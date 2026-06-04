import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-dash-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dash-product-list.component.html',
  styleUrl: './dash-product-list.component.scss'
})
export class DashProductListComponent implements OnInit {
  products: Product[] = [];
  filtered: Product[] = [];
  categories: Category[] = [];
  loading = true;
  search = '';
  filterCat = '';

  constructor(private productSvc: ProductService, private catSvc: CategoryService) {}

  ngOnInit(): void {
    this.catSvc.getAll().subscribe(c => this.categories = c);
    this.productSvc.getAllAdmin().subscribe({
      next: p => { this.products = p; this.filtered = p; this.loading = false; },
      error: () => this.loading = false
    });
  }

  applyFilter(): void {
    this.filtered = this.products.filter(p => {
      const matchCat = !this.filterCat || (typeof p.category === 'object' ? (p.category as Category)._id : p.category) === this.filterCat;
      const matchSearch = !this.search || p.name.toLowerCase().includes(this.search.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  getCatName(p: Product): string {
    return typeof p.category === 'object' ? (p.category as Category).name : '';
  }
  getCatColor(p: Product): string {
    return typeof p.category === 'object' ? (p.category as Category).color || '#4f46e5' : '#4f46e5';
  }

  delete(id: string): void {
    if (!confirm('Delete this product?')) return;
    this.productSvc.delete(id).subscribe(() => {
      this.products = this.products.filter(p => p._id !== id);
      this.applyFilter();
    });
  }
}
