import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  total = 0;
  pages = 1;
  currentPage = 1;
  loading = true;

  filters = { category: '', subcategory: '', search: '' };
  selectedCategory: Category | null = null;

  constructor(
    private productSvc: ProductService,
    private categorySvc: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categorySvc.getActive().subscribe(cats => {
      this.categories = cats;
      this.route.queryParams.subscribe(p => {
        this.filters.category    = p['category']    || '';
        this.filters.subcategory = p['subcategory'] || '';
        this.filters.search      = p['search']      || '';
        this.currentPage         = +p['page'] || 1;
        this.selectedCategory    = cats.find(c => c._id === this.filters.category) || null;
        this.loadProducts();
      });
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productSvc.getAll({ ...this.filters, page: this.currentPage, limit: 12 }).subscribe({
      next: r => { this.products = r.products; this.total = r.total; this.pages = r.pages; this.loading = false; },
      error: () => this.loading = false
    });
  }

  selectCategory(cat: Category | null): void {
    this.router.navigate(['/shop'], { queryParams: { category: cat?._id || '', subcategory: '', page: 1 } });
  }

  selectSub(slug: string): void {
    this.router.navigate(['/shop'], { queryParams: { category: this.filters.category, subcategory: slug, page: 1 } });
  }

  onSearch(): void {
    this.router.navigate(['/shop'], { queryParams: { search: this.filters.search, page: 1 } });
  }

  goPage(p: number): void {
    if (p < 1 || p > this.pages) return;
    this.router.navigate(['/shop'], { queryParams: { ...this.route.snapshot.queryParams, page: p } });
  }

  getCategoryObj(p: Product): Category | null {
    return (typeof p.category === 'object') ? p.category as Category : null;
  }

  pageRange(): number[] {
    return Array.from({ length: this.pages }, (_, i) => i + 1);
  }
}
