import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BulkOrderService } from '../../../services/bulk-order.service';
import { BulkOrder } from '../../../models/bulk-order.model';

@Component({
  selector: 'app-inquiry-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inquiry-list.component.html',
  styleUrl: './inquiry-list.component.scss'
})
export class InquiryListComponent implements OnInit {
  inquiries: BulkOrder[] = [];
  loading = true;
  filterStatus = '';
  expanded: string | null = null;
  updatingId: string | null = null;

  statuses = ['pending','contacted','quoted','completed','cancelled'];
  statusColors: Record<string, string> = {
    pending:   '#f59e0b', contacted: '#3b82f6',
    quoted:    '#8b5cf6', completed: '#10b981', cancelled: '#ef4444',
  };

  constructor(private svc: BulkOrderService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll(this.filterStatus || undefined).subscribe({
      next: d => { this.inquiries = d; this.loading = false; }
    });
  }

  expand(id: string): void { this.expanded = this.expanded === id ? null : id; }

  updateStatus(inq: BulkOrder, status: string): void {
    this.updatingId = inq._id!;
    this.svc.updateStatus(inq._id!, status).subscribe(updated => {
      const i = this.inquiries.findIndex(x => x._id === inq._id);
      if (i > -1) this.inquiries[i] = updated;
      this.updatingId = null;
    });
  }

  delete(id: string): void {
    if (!confirm('Delete this inquiry?')) return;
    this.svc.delete(id).subscribe(() => this.inquiries = this.inquiries.filter(i => i._id !== id));
  }
}
