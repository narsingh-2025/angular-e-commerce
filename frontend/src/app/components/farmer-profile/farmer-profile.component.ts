import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FarmerService } from '../../services/farmer.service';
import { CartService } from '../../services/cart.service';
import { Farmer } from '../../models/farmer.model';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-farmer-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './farmer-profile.component.html',
  styleUrl: './farmer-profile.component.scss'
})
export class FarmerProfileComponent implements OnInit {
  farmer: Farmer | null = null;
  products: Product[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private farmerSvc: FarmerService, private cartSvc: CartService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.farmerSvc.getById(id).subscribe({
      next: ({ farmer, products }) => { this.farmer = farmer; this.products = products; this.loading = false; }
    });
  }

  getCat(p: Product): Category | null {
    return typeof p.category === 'object' ? p.category as Category : null;
  }

  addToCart(p: Product): void {
    const cat = this.getCat(p);
    this.cartSvc.add({
      productId:     p._id!,
      name:          p.name,
      price:         p.price,
      unit:          p.unit || 'piece',
      quantity:      p.minOrderQty || 1,
      categoryIcon:  cat?.icon,
      categoryColor: cat?.color,
      maxStock:      p.stock,
    });
  }

  initials(name: string): string { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
  stars(n: number): number[]     { return Array.from({ length: Math.round(n || 0) }); }
}
