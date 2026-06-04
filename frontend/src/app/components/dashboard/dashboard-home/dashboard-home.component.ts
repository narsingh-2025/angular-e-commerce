import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { BulkOrder } from '../../../models/bulk-order.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  stats: any = null;
  loading = true;

  statusColors: Record<string, string> = {
    pending:   '#f59e0b',
    contacted: '#3b82f6',
    quoted:    '#8b5cf6',
    completed: '#10b981',
    cancelled: '#ef4444',
  };

  constructor(private dashSvc: DashboardService) {}

  ngOnInit(): void {
    this.dashSvc.getStats().subscribe({
      next: s => { this.stats = s; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
