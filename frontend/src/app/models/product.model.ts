import { Category } from './category.model';
import { Farmer }   from './farmer.model';

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
  farmer?: string | Farmer;
  isOrganic?: boolean;
  farmLocation?: string;
  harvestSeason?: string;
  avgRating?: number;
  reviewCount?: number;
  createdAt?: string;
}
