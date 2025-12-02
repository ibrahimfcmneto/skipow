export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export type TokenStatus = "DISPONIVEL" | "CONSUMIDO";

export interface Token {
  id: string;
  status: TokenStatus;
  productName: string;
  productImage: string;
  createdAt: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
