import { Product } from "@/types/product";
import PawapayCustomerForm from "./PawapayCustomerForm";

interface PageLayoutProps {
  product: Product;
}

const PageLayout = ({ product }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FFDDFF]">
      <header className="fixed top-0 left-0 right-0 bg-[#FFAADD] p-4 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">{product.name}</h1>
          <div className="text-lg font-semibold">
            {product.amount.toLocaleString()} XOF
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-20 pb-10 px-4">
        <div className="max-w-3xl mx-auto">
          <PawapayCustomerForm
            amount={product.amount}
            description={product.description}
            paymentLinkId={product.payment_link_id || ""}
            onClose={() => {}}
          />
        </div>
      </main>
    </div>
  );
};

export default PageLayout;