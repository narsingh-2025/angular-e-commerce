import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BulkOrder } from '../models/bulk-order.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BulkOrderService {
  private api = `${environment.apiUrl}/bulk-orders`;
  constructor(private http: HttpClient) {}

  getAll(status?: string): Observable<BulkOrder[]> {
    const url = status ? `${this.api}?status=${status}` : this.api;
    return this.http.get<BulkOrder[]>(url);
  }
  getById(id: string): Observable<BulkOrder> { return this.http.get<BulkOrder>(`${this.api}/${id}`); }
  create(o: BulkOrder): Observable<BulkOrder> { return this.http.post<BulkOrder>(this.api, o); }
  updateStatus(id: string, status: string, notes?: string): Observable<BulkOrder> {
    return this.http.patch<BulkOrder>(`${this.api}/${id}/status`, { status, notes });
  }
  delete(id: string): Observable<any> { return this.http.delete(`${this.api}/${id}`); }
}
