import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  productId = '';
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: [''],
      stock: [0, [Validators.min(0)]]
    });

    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isEdit = true;
      this.productService.getById(this.productId).subscribe({
        next: (p) => this.form.patchValue(p),
        error: () => this.error = 'Failed to load product.'
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const data = this.form.value;

    const op = this.isEdit
      ? this.productService.update(this.productId, data)
      : this.productService.create(data);

    op.subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => { this.error = err.error?.message || 'Save failed.'; this.loading = false; }
    });
  }
}
