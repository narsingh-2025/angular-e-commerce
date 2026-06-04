import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-dash-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dash-product-form.component.html',
  styleUrl: './dash-product-form.component.scss'
})
export class DashProductFormComponent implements OnInit {
  form!: FormGroup;
  categories: Category[] = [];
  selectedCat: Category | null = null;
  isEdit = false;
  productId = '';
  loading = false;
  error = '';

  units = ['piece','kg','g','box','bag','pack','set','bundle','meter','liter','dozen'];

  constructor(
    private fb: FormBuilder,
    private productSvc: ProductService,
    private catSvc: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.catSvc.getAll().subscribe(c => { this.categories = c; });

    this.form = this.fb.group({
      name:        ['', Validators.required],
      description: [''],
      price:       [0, [Validators.required, Validators.min(0)]],
      category:    ['', Validators.required],
      subcategory: [''],
      brand:       [''],
      unit:        ['piece'],
      stock:       [0, Validators.min(0)],
      minOrderQty: [1, Validators.min(1)],
      isActive:    [true],
      isFeatured:  [false],
      tags:        [''],
      bulkPricing: this.fb.array([]),
    });

    this.form.get('category')!.valueChanges.subscribe(id => {
      this.selectedCat = this.categories.find(c => c._id === id) || null;
    });

    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isEdit = true;
      this.productSvc.getById(this.productId).subscribe(p => {
        const catId = typeof p.category === 'object' ? (p.category as any)._id : p.category;
        this.form.patchValue({ ...p, category: catId, tags: p.tags?.join(', ') || '' });
        p.bulkPricing?.forEach(t => this.tiers.push(this.newTier(t.minQty, t.price)));
      });
    }
  }

  get tiers(): FormArray { return this.form.get('bulkPricing') as FormArray; }
  newTier(minQty = 0, price = 0): FormGroup {
    return this.fb.group({ minQty: [minQty, Validators.required], price: [price, Validators.required] });
  }
  addTier(): void  { this.tiers.push(this.newTier()); }
  removeTier(i: number): void { this.tiers.removeAt(i); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const raw = { ...this.form.value };
    raw.tags = raw.tags ? raw.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

    const op = this.isEdit ? this.productSvc.update(this.productId, raw) : this.productSvc.create(raw);
    op.subscribe({
      next: () => this.router.navigate(['/dashboard/products']),
      error: err => { this.error = err.error?.message || 'Save failed.'; this.loading = false; }
    });
  }
}
