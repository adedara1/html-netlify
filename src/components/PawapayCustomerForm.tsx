import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard } from "lucide-react";

interface PawapayCustomerFormProps {
  amount: number;
  description: string;
  paymentLinkId: string;
  onClose: () => void;
}

const PawapayCustomerForm = ({ amount, description, paymentLinkId, onClose }: PawapayCustomerFormProps) => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "-50px",
      }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (amount < 200) {
        toast({
          title: "Montant invalide",
          description: "Le montant minimum est de 200 FCFA",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log("Initiating PawaPay payment with customer info:", {
        amount,
        description,
        customerEmail,
        customerFirstName,
        customerLastName,
        customerPhone
      });

      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        "initiate-pawapay-payment",
        {
          body: {
            amount,
            description,
            customer: {
              email: customerEmail,
              first_name: customerFirstName,
              last_name: customerLastName,
              phone: customerPhone
            }
          }
        }
      );

      if (paymentError) {
        console.error("PawaPay payment error:", paymentError);
        throw paymentError;
      }

      console.log("PawaPay payment initiated successfully:", paymentData);

      if (!paymentData.payment_url) {
        throw new Error("URL de paiement PawaPay manquante dans la réponse");
      }

      window.location.href = paymentData.payment_url;
    } catch (error) {
      console.error("Error initiating PawaPay payment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'initiation du paiement PawaPay",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  return (
    <>
      <Card className="p-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="email@exemple.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <Input
                value={customerFirstName}
                onChange={(e) => setCustomerFirstName(e.target.value)}
                placeholder="Prénom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <Input
                value={customerLastName}
                onChange={(e) => setCustomerLastName(e.target.value)}
                placeholder="Nom"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <Input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+221 XX XXX XX XX"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Traitement..." : "Payer avec PawaPay"}
          </Button>
        </form>
      </Card>

      {!isFormVisible && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-50 flex justify-center">
          <Button 
            onClick={scrollToForm} 
            className="w-full md:w-[500px] bg-green-600 hover:bg-green-700 text-base"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Payer {formatAmount(amount)} FCFA avec PawaPay
          </Button>
        </div>
      )}
    </>
  );
};

export default PawapayCustomerForm;