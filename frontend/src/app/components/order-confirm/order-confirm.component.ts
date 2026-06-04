import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-confirm',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirm.component.html',
  styleUrl: './order-confirm.component.scss'
})
export class OrderConfirmComponent implements OnInit {
  order: Order | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private orderSvc: OrderService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.orderSvc.getById(id).subscribe({
      next: o => { this.order = o; this.loading = false; },
      error: () => this.loading = false,
    });
  }
}
