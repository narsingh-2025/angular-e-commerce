export interface Review {
  _id?: string;
  product: string;
  name: string;
  email: string;
  rating: number;
  title?: string;
  comment: string;
  verified?: boolean;
  helpful?: number;
  createdAt?: string;
}
