import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = 'http://localhost:3000/api/categories';
  constructor(private http: HttpClient) {}

  getActive(): Observable<Category[]>  { return this.http.get<Category[]>(this.api); }
  getAll():    Observable<Category[]>  { return this.http.get<Category[]>(`${this.api}/all`); }
  getById(id: string): Observable<Category> { return this.http.get<Category>(`${this.api}/${id}`); }
  create(c: Category):  Observable<Category> { return this.http.post<Category>(this.api, c); }
  update(id: string, c: Category): Observable<Category> { return this.http.put<Category>(`${this.api}/${id}`, c); }
  delete(id: string):  Observable<any>     { return this.http.delete(`${this.api}/${id}`); }
}
