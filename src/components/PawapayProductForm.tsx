import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PriceInput } from "./PriceInput";
import { ProductImageInput } from "./product/ProductImageInput";
import { ProductBasicInfo } from "./product/ProductBasicInfo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PawapayConfiguration {
  country_code: string;
  country_name: string;
  currency_code: string;
  correspondent_code: string;
  correspondent_name: string;
}

const PawapayProductForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [configurations, setConfigurations] = useState<PawapayConfiguration[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCorrespondent, setSelectedCorrespondent] = useState("");

  useEffect(() => {
    const fetchConfigurations = async () => {
      const { data, error } = await supabase
        .from('pawapay_configurations')
        .select('*');
      
      if (error) {
        console.error('Error fetching configurations:', error);
        return;
      }
      
      setConfigurations(data);
    };
    
    fetchConfigurations();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const selectedConfig = configurations.find(c => 
    c.country_code === selectedCountry && c.correspondent_code === selectedCorrespondent
  );

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedConfig) {
      toast({
        title: "Configuration invalide",
        description: "Veuillez sélectionner un pays et un opérateur",
        variant: "destructive",
      });
      return;
    }
    
    if (parseInt(amount) < 200) {
      toast({
        title: "Montant invalide",
        description: "Le montant minimum est de 200",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Utilisateur non authentifié");
      }

      let imageUrl = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const { data: productData, error: productError } = await supabase
        .from('pawapay_products')
        .insert({
          name,
          description,
          long_description: longDescription || null,
          amount: Math.round(parseFloat(amount)),
          image_url: imageUrl,
          user_id: user.id,
          country_code: selectedConfig.country_code,
          currency_code: selectedConfig.currency_code,
          correspondent_code: selectedConfig.correspondent_code
        })
        .select()
        .single();

      if (productError) throw productError;
      
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès",
      });
      
      queryClient.invalidateQueries({ queryKey: ["pawapay-products"] });
      
      // Reset form
      setName("");
      setDescription("");
      setLongDescription("");
      setAmount("");
      setImage(null);
      setSelectedCountry("");
      setSelectedCorrespondent("");
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du produit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const countryOptions = [...new Set(configurations.map(c => c.country_code))];
  const correspondentOptions = configurations
    .filter(c => c.country_code === selectedCountry)
    .map(c => ({
      code: c.correspondent_code,
      name: c.correspondent_name
    }));

  return (
    <Card className="p-6">
      <form onSubmit={createProduct} className="space-y-4">
        <ProductBasicInfo
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
        />
        
        <div>
          <label className="block text-sm font-medium mb-1">Description détaillée (optionnel)</label>
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            placeholder="Description détaillée du produit"
            className="w-full min-h-[100px] p-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pays</label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((code) => (
                  <SelectItem key={code} value={code}>
                    {configurations.find(c => c.country_code === code)?.country_name || code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Opérateur</label>
            <Select value={selectedCorrespondent} onValueChange={setSelectedCorrespondent}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un opérateur" />
              </SelectTrigger>
              <SelectContent>
                {correspondentOptions.map((op) => (
                  <SelectItem key={op.code} value={op.code}>
                    {op.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prix</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Minimum 200"
            className="w-full p-2 border rounded-md"
            min="200"
            required
          />
          {selectedConfig && (
            <p className="text-sm text-gray-500 mt-1">
              Devise: {selectedConfig.currency_code}
            </p>
          )}
        </div>

        <ProductImageInput
          handleImageChange={handleImageChange}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Création..." : "Créer le produit"}
        </Button>
      </form>
    </Card>
  );
};

export default PawapayProductForm;