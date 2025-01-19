import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PawapayProductForm from "@/components/PawapayProductForm";
import ProductCard from "@/components/product/ProductCard";
import ProductListView from "@/components/product/ProductListView";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Plus, LayoutGrid, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: products, isLoading } = useQuery({
    queryKey: ["pawapay-products"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("pawapay_products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("pawapay_products")
        .delete()
        .in("id", selectedProducts);

      if (error) throw error;

      toast({
        title: "Produits supprimés",
        description: `${selectedProducts.length} produit(s) supprimé(s) avec succès`,
      });

      setSelectedProducts([]);
    } catch (error) {
      console.error("Error deleting products:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    if (selectedProducts.length === 1) {
      navigate(`/product/${selectedProducts[0]}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Créer un nouveau produit PawaPay</h1>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Fermer" : "Créer un produit"}
          </Button>
        </div>
        {showForm && <PawapayProductForm />}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Vos produits</h2>
          {selectedProducts.length > 0 && (
            <div className="flex gap-2">
              {selectedProducts.length === 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {selectedProducts.length > 1 ? "Supprimer la sélection" : "Supprimer"}
              </Button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Cliquer sur un produit pour le modifier ou le supprimer
        </p>
        
        <div className="flex gap-2 mb-4">
          <Button
            variant={viewMode === 'grid' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Vue en Cartes
          </Button>
          <Button
            variant={viewMode === 'list' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('list')}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            Vue en Liste
          </Button>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onSelect={() => handleProductSelect(product.id)}
              />
            ))}
          </div>
        ) : (
          <ProductListView
            products={products || []}
            selectedProducts={selectedProducts}
            onProductSelect={handleProductSelect}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
