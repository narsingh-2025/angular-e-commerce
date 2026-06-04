export interface OrderCustomer {
  name: string; email: string; phone: string;
  address: string; city: string; state: string; pincode: string;
}
export interface OrderItem {
  productId?: string; productName: string;
  price: number; quantity: number; unit: string; subtotal: number;
}
export interface Order {
  _id?: string;
  orderNumber?: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  payment?: { status: string; razorpayPaymentId?: string; method?: string; };
  status?: string;
  createdAt?: string;
}
