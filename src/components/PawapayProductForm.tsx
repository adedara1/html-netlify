import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PriceInput } from "./PriceInput";
import { ProductImageInput } from "./product/ProductImageInput";
import { ProductBasicInfo } from "./product/ProductBasicInfo";

const PawapayProductForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [correspondentCode, setCorrespondentCode] = useState("");

  useEffect(() => {
    const fetchPawapayConfigurations = async () => {
      try {
        const { data, error } = await supabase
          .from('pawapay_configurations')
          .select('*')
          .limit(1); // Get just the first configuration
        
        if (error) {
          console.error('Error fetching PawaPay configurations:', error);
          return;
        }
        
        if (data && data.length > 0) {
          const config = data[0];
          setCountryCode(config.country_code);
          setCurrencyCode(config.currency_code);
          setCorrespondentCode(config.correspondent_code);
        }
      } catch (error) {
        console.error('Error fetching PawaPay configurations:', error);
      }
    };
    
    fetchPawapayConfigurations();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseInt(amount) < 200) {
      toast({
        title: "Montant invalide",
        description: "Le montant minimum est de 200 FCFA",
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

      const { data: depositData, error: depositError } = await supabase.functions.invoke(
        "create-pawapay-deposit",
        {
          body: {
            amount: Math.round(parseFloat(amount)),
            description: description || name,
            country_code: countryCode,
            currency_code: currencyCode,
            correspondent_code: correspondentCode
          }
        }
      );

      if (depositError) throw depositError;

      const { data: productData, error: productError } = await supabase
        .from('pawapay_products')
        .insert({
          name,
          description,
          long_description: longDescription || null,
          amount: Math.round(parseFloat(amount)),
          image_url: imageUrl,
          user_id: user.id,
          country_code: countryCode,
          currency_code: currencyCode,
          correspondent_code: correspondentCode,
          deposit_id: depositData.deposit_id
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
          <label className="block text-sm font-medium mb-1">Longue description (optionnel)</label>
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            placeholder="Description détaillée du produit"
            className="w-full min-h-[100px] p-2 border rounded-md"
          />
        </div>

        <PriceInput
          currency={currencyCode}
          setCurrency={setCurrencyCode}
          amount={amount}
          setAmount={setAmount}
        />

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