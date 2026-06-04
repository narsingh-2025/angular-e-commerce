export interface Farmer {
  _id?: string;
  name: string;
  farmName: string;
  phone: string;
  email?: string;
  location: string;
  state?: string;
  description?: string;
  coverColor?: string;
  specialities?: string[];
  certifications?: string[];
  isOrganic?: boolean;
  isVerified?: boolean;
  yearsActive?: number;
  isActive?: boolean;
  rating?: number;
  totalSales?: number;
  createdAt?: string;
}
