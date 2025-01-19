export interface PaymentLink {
  id: string;
  moneroo_token: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  long_description: string | null;
  amount: number;
  image_url: string | null;
  payment_link_id?: string | null; // Optional
  payment_links?: PaymentLink; // Restored this property
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PawapayProduct {
  id: string;
  name: string;
  description: string | null;
  long_description: string | null;
  amount: number;
  image_url: string | null;
  user_id: string | null;
  country_code: string;
  currency_code: string;
  correspondent_code: string;
  deposit_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type AnyProduct = Product | PawapayProduct;

export const isPawapayProduct = (product: AnyProduct): product is PawapayProduct => {
  return 'currency_code' in product;
};