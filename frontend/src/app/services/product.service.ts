import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface ProductPage { products: Product[]; total: number; page: number; pages: number; }

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = 'http://localhost:3000/api/products';
  constructor(private http: HttpClient) {}

  getAll(filters: { category?: string; subcategory?: string; featured?: boolean; search?: string; page?: number; limit?: number } = {}): Observable<ProductPage> {
    let params = new HttpParams();
    if (filters.category)    params = params.set('category',    filters.category);
    if (filters.subcategory) params = params.set('subcategory', filters.subcategory);
    if (filters.featured)    params = params.set('featured',    'true');
    if (filters.search)      params = params.set('search',      filters.search);
    if (filters.page)        params = params.set('page',        String(filters.page));
    if (filters.limit)       params = params.set('limit',       String(filters.limit));
    return this.http.get<ProductPage>(this.api, { params });
  }

  getAllAdmin(): Observable<Product[]> { return this.http.get<Product[]>(`${this.api}/all`); }
  getById(id: string): Observable<Product> { return this.http.get<Product>(`${this.api}/${id}`); }
  create(p: any):  Observable<Product> { return this.http.post<Product>(this.api, p); }
  update(id: string, p: any): Observable<Product> { return this.http.put<Product>(`${this.api}/${id}`, p); }
  delete(id: string): Observable<any>  { return this.http.delete(`${this.api}/${id}`); }
}
