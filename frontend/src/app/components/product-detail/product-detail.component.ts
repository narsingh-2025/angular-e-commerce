import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  qty = 1;

  constructor(private route: ActivatedRoute, private productSvc: ProductService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.productSvc.getById(id).subscribe({
      next: p => { this.product = p; this.qty = p.minOrderQty || 1; this.loading = false; },
      error: () => this.loading = false
    });
  }

  getCategory(): Category | null {
    return this.product && typeof this.product.category === 'object' ? this.product.category as Category : null;
  }

  getUnitPrice(): number {
    if (!this.product) return 0;
    if (!this.product.bulkPricing?.length) return this.product.price;
    const tier = [...(this.product.bulkPricing)]
      .sort((a, b) => b.minQty - a.minQty)
      .find(t => this.qty >= t.minQty);
    return tier ? tier.price : this.product.price;
  }

  getTotal(): number { return this.getUnitPrice() * this.qty; }
}
