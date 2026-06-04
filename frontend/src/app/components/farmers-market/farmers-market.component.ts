import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FarmerService } from '../../services/farmer.service';
import { Farmer } from '../../models/farmer.model';

@Component({
  selector: 'app-farmers-market',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './farmers-market.component.html',
  styleUrl: './farmers-market.component.scss'
})
export class FarmersMarketComponent implements OnInit {
  farmers: Farmer[] = [];
  loading = true;

  constructor(private farmerSvc: FarmerService) {}
  ngOnInit(): void {
    this.farmerSvc.getAll().subscribe({ next: f => { this.farmers = f; this.loading = false; } });
  }

  stars(n: number): number[] { return Array.from({ length: Math.round(n || 0) }); }
  initials(name: string): string { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
}
