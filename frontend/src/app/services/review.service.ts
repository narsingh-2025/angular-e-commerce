import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private api = `${environment.apiUrl}/reviews`;
  constructor(private http: HttpClient) {}
  getByProduct(id: string): Observable<Review[]> { return this.http.get<Review[]>(`${this.api}/product/${id}`); }
  create(r: Review): Observable<Review>           { return this.http.post<Review>(this.api, r); }
  markHelpful(id: string): Observable<Review>     { return this.http.patch<Review>(`${this.api}/${id}/helpful`, {}); }
  delete(id: string): Observable<any>             { return this.http.delete(`${this.api}/${id}`); }
}
