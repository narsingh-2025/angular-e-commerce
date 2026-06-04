import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductReviewsComponent } from '../product-reviews/product-reviews.component';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Farmer } from '../../models/farmer.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductReviewsComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  qty = 1;
  addedToCart = false;

  constructor(
    private route: ActivatedRoute,
    private productSvc: ProductService,
    private cartSvc: CartService
  ) {}

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

  getFarmer(): Farmer | null {
    return this.product && this.product.farmer && typeof this.product.farmer === 'object'
      ? this.product.farmer as unknown as Farmer : null;
  }

  getUnitPrice(): number {
    if (!this.product) return 0;
    if (!this.product.bulkPricing?.length) return this.product.price;
    const tier = [...(this.product.bulkPricing)].sort((a, b) => b.minQty - a.minQty).find(t => this.qty >= t.minQty);
    return tier ? tier.price : this.product.price;
  }

  getTotal(): number { return this.getUnitPrice() * this.qty; }

  addToCart(): void {
    if (!this.product) return;
    const cat = this.getCategory();
    this.cartSvc.add({
      productId:     this.product._id!,
      name:          this.product.name,
      price:         this.getUnitPrice(),
      unit:          this.product.unit || 'piece',
      quantity:      this.qty,
      categoryIcon:  cat?.icon,
      categoryColor: cat?.color,
      maxStock:      this.product.stock,
    });
    this.addedToCart = true;
    setTimeout(() => this.addedToCart = false, 2500);
  }

  starArray(n: number): number[] { return Array.from({ length: Math.round(n || 0) }); }
  emptyArray(n: number): number[] { return Array.from({ length: 5 - Math.round(n || 0) }); }
}
