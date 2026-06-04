import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  catId = '';
  loading = false;
  error = '';

  colorOptions = ['#4f46e5','#8b5cf6','#ec4899','#ef4444','#f59e0b','#10b981','#3b82f6','#06b6d4','#84cc16','#f97316'];

  constructor(private fb: FormBuilder, private catSvc: CategoryService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:        ['', Validators.required],
      slug:        ['', Validators.required],
      description: [''],
      icon:        ['📦'],
      color:       ['#4f46e5'],
      sortOrder:   [0],
      isActive:    [true],
      subcategories: this.fb.array([]),
    });

    this.form.get('name')!.valueChanges.subscribe(v => {
      if (!this.isEdit) this.form.get('slug')!.setValue(v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    });

    this.catId = this.route.snapshot.params['id'];
    if (this.catId) {
      this.isEdit = true;
      this.catSvc.getById(this.catId).subscribe(c => {
        this.form.patchValue(c);
        c.subcategories?.forEach(s => this.subs.push(this.newSub(s.name, s.slug)));
      });
    }
  }

  get subs(): FormArray { return this.form.get('subcategories') as FormArray; }
  newSub(name = '', slug = ''): FormGroup {
    return this.fb.group({ name: [name, Validators.required], slug: [slug, Validators.required] });
  }
  addSub(): void { this.subs.push(this.newSub()); }
  removeSub(i: number): void { this.subs.removeAt(i); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const op = this.isEdit ? this.catSvc.update(this.catId, this.form.value) : this.catSvc.create(this.form.value);
    op.subscribe({
      next: () => this.router.navigate(['/dashboard/categories']),
      error: err => { this.error = err.error?.message || 'Save failed.'; this.loading = false; }
    });
  }
}
