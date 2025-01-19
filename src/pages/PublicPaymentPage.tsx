import ProductPageLayout from "@/components/product/ProductPageLayout";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";

const PublicPaymentPage = () => {
  const [product, setProduct] = useState<Product>({
    id: "725872d8-1cbe-4723-9d42-21e6ba1151ec",
    name: "Digit-Sarl Payment",
    description: "Paiement sécurisé via Digit-Sarl",
    long_description: null,
    amount: 5000,
    image_url: "/lovable-uploads/cba544ba-0ad2-4425-ba9c-1ce8aed026cb.png",
    payment_link_id: "725872d8-1cbe-4723-9d42-21e6ba1151ec",
    user_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  return <ProductPageLayout product={product} />;
};

export default PublicPaymentPage;