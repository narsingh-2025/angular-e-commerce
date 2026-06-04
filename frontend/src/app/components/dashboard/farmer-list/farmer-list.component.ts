import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FarmerService } from '../../../services/farmer.service';
import { Farmer } from '../../../models/farmer.model';

@Component({
  selector: 'app-farmer-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './farmer-list.component.html',
  styleUrl: './farmer-list.component.scss'
})
export class FarmerListComponent implements OnInit {
  farmers: Farmer[] = [];
  loading = true;

  constructor(private svc: FarmerService) {}
  ngOnInit(): void { this.svc.getAllAdmin().subscribe({ next: f => { this.farmers = f; this.loading = false; } }); }
  initials(n: string): string { return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2); }
  delete(id: string): void {
    if (!confirm('Delete this farmer?')) return;
    this.svc.delete(id).subscribe(() => this.farmers = this.farmers.filter(f => f._id !== id));
  }
}
