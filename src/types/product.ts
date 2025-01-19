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
  payment_link_id: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  payment_links?: PaymentLink;
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
  deposit_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export type AnyProduct = Product | PawapayProduct;

export const isPawapayProduct = (product: AnyProduct): product is PawapayProduct => {
  return 'correspondent_code' in product;
};