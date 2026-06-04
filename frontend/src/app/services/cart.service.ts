import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private KEY = 'farmdirect_cart';
  private _items = new BehaviorSubject<CartItem[]>(this.load());
  private _open  = new BehaviorSubject<boolean>(false);

  items$ = this._items.asObservable();
  open$  = this._open.asObservable();

  get items(): CartItem[]  { return this._items.value; }
  get count(): number      { return this.items.reduce((s, i) => s + i.quantity, 0); }
  get total(): number      { return this.items.reduce((s, i) => s + i.price * i.quantity, 0); }
  get isEmpty(): boolean   { return this.items.length === 0; }

  openCart():  void { this._open.next(true); }
  closeCart(): void { this._open.next(false); }

  add(item: CartItem): void {
    const list = [...this.items];
    const idx  = list.findIndex(i => i.productId === item.productId);
    if (idx > -1) {
      list[idx] = { ...list[idx], quantity: list[idx].quantity + item.quantity };
    } else {
      list.push(item);
    }
    this.save(list);
    this._open.next(true);
  }

  update(productId: string, qty: number): void {
    this.save(this.items.map(i => i.productId === productId ? { ...i, quantity: qty } : i).filter(i => i.quantity > 0));
  }

  remove(productId: string): void {
    this.save(this.items.filter(i => i.productId !== productId));
  }

  clear(): void { this.save([]); }

  private load(): CartItem[] {
    try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); } catch { return []; }
  }
  private save(items: CartItem[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this._items.next(items);
  }
}
