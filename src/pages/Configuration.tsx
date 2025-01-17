import { useState, useEffect } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Configuration = () => {
  const [percentage, setPercentage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
        
        setIsAdmin(!!adminUser);

        if (adminUser) {
          // Fetch global settings
          const { data: settings, error } = await supabase
            .from('global_settings')
            .select('product_fee_percentage')
            .single();
          
          if (error) {
            console.error('Error fetching global settings:', error);
            return;
          }
          
          if (settings) {
            setPercentage(settings.product_fee_percentage.toString());
          }
        }
      }
    };
    
    checkAdminStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent modifier ces paramètres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('global_settings')
        .update({ product_fee_percentage: parseFloat(percentage) })
        .eq('id', (await supabase.from('global_settings').select('id').single()).data?.id);

      if (error) throw error;
      
      toast({
        title: "Paramètres mis à jour",
        description: "Les frais globaux ont été mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating global settings:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des paramètres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Configuration</h1>
        </div>
        <p className="text-gray-600">
          Vous n'avez pas accès à cette section. Seuls les administrateurs peuvent configurer les frais globaux.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Configuration</h1>
      </div>
      
      <Card className="p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Frais globaux sur les produits</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Pourcentage de frais à appliquer pour tous les utilisateurs
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="Ex: 5"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  className="max-w-[200px]"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
              <p className="text-sm text-gray-500">
                Ce pourcentage sera automatiquement ajouté au prix des produits de tous les utilisateurs
              </p>
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Configuration;