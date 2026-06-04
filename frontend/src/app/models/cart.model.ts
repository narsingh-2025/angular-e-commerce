export interface CartItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  categoryIcon?: string;
  categoryColor?: string;
  maxStock?: number;
}
