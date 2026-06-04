import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  filterStatus = '';
  expanded: string | null = null;
  statuses = ['pending','confirmed','processing','shipped','delivered','cancelled'];
  statusColors: Record<string,string> = { pending:'#f59e0b', confirmed:'#3b82f6', processing:'#8b5cf6', shipped:'#06b6d4', delivered:'#10b981', cancelled:'#ef4444' };

  constructor(private svc: OrderService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.loading = true; this.svc.getAll(this.filterStatus || undefined).subscribe({ next: o => { this.orders = o; this.loading = false; } }); }
  expand(id: string): void { this.expanded = this.expanded === id ? null : id; }
  updateStatus(order: Order, status: string): void {
    this.svc.updateStatus(order._id!, status).subscribe(u => {
      const i = this.orders.findIndex(o => o._id === order._id);
      if (i > -1) this.orders[i] = u;
    });
  }
}
