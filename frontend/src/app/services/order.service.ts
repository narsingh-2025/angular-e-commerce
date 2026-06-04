import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = `${environment.apiUrl}/orders`;
  constructor(private http: HttpClient) {}
  createPayment(total: number): Observable<any>   { return this.http.post(`${this.api}/create-payment`, { total }); }
  verifyAndSave(data: any): Observable<Order>     { return this.http.post<Order>(`${this.api}/verify`, data); }
  getAll(status?: string): Observable<Order[]>    { return this.http.get<Order[]>(status ? `${this.api}?status=${status}` : this.api); }
  getById(id: string): Observable<Order>          { return this.http.get<Order>(`${this.api}/${id}`); }
  updateStatus(id: string, status: string): Observable<Order> { return this.http.patch<Order>(`${this.api}/${id}/status`, { status }); }
}
