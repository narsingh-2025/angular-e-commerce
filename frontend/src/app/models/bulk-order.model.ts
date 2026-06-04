export interface OrderItem { productName: string; quantity: number; unit: string; }

export interface BulkOrder {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  category?: string;
  items?: OrderItem[];
  message: string;
  status?: 'pending' | 'contacted' | 'quoted' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: string;
}
