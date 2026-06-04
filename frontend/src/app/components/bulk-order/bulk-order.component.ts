import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BulkOrderService } from '../../services/bulk-order.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-bulk-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './bulk-order.component.html',
  styleUrl: './bulk-order.component.scss'
})
export class BulkOrderComponent implements OnInit {
  form!: FormGroup;
  categories: Category[] = [];
  submitted = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private bulkOrderSvc: BulkOrderService,
    private categorySvc: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categorySvc.getActive().subscribe(c => this.categories = c);

    const q = this.route.snapshot.queryParams;
    this.form = this.fb.group({
      name:    ['', Validators.required],
      email:   ['', [Validators.required, Validators.email]],
      phone:   ['', Validators.required],
      company: [''],
      category:[q['category'] || ''],
      message: ['', [Validators.required, Validators.minLength(20)]],
      items:   this.fb.array([this.newItem(q['product'] || '', q['qty'] || '', q['unit'] || '')]),
    });
  }

  get items(): FormArray { return this.form.get('items') as FormArray; }

  newItem(name = '', qty = '', unit = ''): FormGroup {
    return this.fb.group({
      productName: [name, Validators.required],
      quantity:    [qty ? +qty : null, [Validators.required, Validators.min(1)]],
      unit:        [unit || 'piece'],
    });
  }

  addItem(): void  { this.items.push(this.newItem()); }
  removeItem(i: number): void { if (this.items.length > 1) this.items.removeAt(i); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.bulkOrderSvc.create(this.form.value).subscribe({
      next: () => { this.submitted = true; this.loading = false; },
      error: () => { this.error = 'Submission failed. Please try again.'; this.loading = false; }
    });
  }
}
