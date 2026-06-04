import { Category } from './category.model';

export interface BulkPrice { minQty: number; price: number; }

export interface Product {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  category: string | Category;
  subcategory?: string;
  brand?: string;
  unit?: string;
  stock?: number;
  minOrderQty?: number;
  bulkPricing?: BulkPrice[];
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}
