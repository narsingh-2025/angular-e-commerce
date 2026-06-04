import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.scss'
})
export class CartSidebarComponent {
  constructor(public cartSvc: CartService) {}

  updateQty(item: CartItem, qty: number): void {
    this.cartSvc.update(item.productId, qty);
  }

  remove(productId: string): void {
    this.cartSvc.remove(productId);
  }
}
