export interface Subcategory { name: string; slug: string; }

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  subcategories?: Subcategory[];
  isActive?: boolean;
  sortOrder?: number;
}
