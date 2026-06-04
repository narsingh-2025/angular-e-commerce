import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Farmer } from '../models/farmer.model';

@Injectable({ providedIn: 'root' })
export class FarmerService {
  private api = 'http://localhost:3000/api/farmers';
  constructor(private http: HttpClient) {}
  getAll():   Observable<Farmer[]>  { return this.http.get<Farmer[]>(this.api); }
  getAllAdmin(): Observable<Farmer[]> { return this.http.get<Farmer[]>(`${this.api}/all`); }
  getById(id: string): Observable<{ farmer: Farmer; products: any[] }> { return this.http.get<any>(`${this.api}/${id}`); }
  create(f: Farmer): Observable<Farmer>  { return this.http.post<Farmer>(this.api, f); }
  update(id: string, f: Farmer): Observable<Farmer> { return this.http.put<Farmer>(`${this.api}/${id}`, f); }
  delete(id: string): Observable<any>    { return this.http.delete(`${this.api}/${id}`); }
}
