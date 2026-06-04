import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss'
})
export class ProductReviewsComponent implements OnInit {
  @Input() productId!: string;
  Math = Math;

  reviews: Review[] = [];
  form!: FormGroup;
  showForm = false;
  submitted = false;
  hoverStar = 0;

  get avgRating(): number {
    if (!this.reviews.length) return 0;
    return Math.round(this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length * 10) / 10;
  }

  ratingDist(star: number): number {
    if (!this.reviews.length) return 0;
    return Math.round(this.reviews.filter(r => r.rating === star).length / this.reviews.length * 100);
  }

  constructor(private reviewSvc: ReviewService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.reviewSvc.getByProduct(this.productId).subscribe(r => this.reviews = r);
    this.form = this.fb.group({
      name:    ['', Validators.required],
      email:   ['', [Validators.required, Validators.email]],
      rating:  [0,  [Validators.required, Validators.min(1)]],
      title:   [''],
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  setRating(n: number): void { this.form.get('rating')!.setValue(n); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.reviewSvc.create({ ...this.form.value, product: this.productId }).subscribe(r => {
      this.reviews = [r, ...this.reviews];
      this.submitted = true;
      this.showForm  = false;
      this.form.reset();
    });
  }

  helpful(r: Review): void {
    this.reviewSvc.markHelpful(r._id!).subscribe(updated => {
      const i = this.reviews.findIndex(x => x._id === r._id);
      if (i > -1) this.reviews[i] = updated;
    });
  }

  stars(n: number): number[] { return Array.from({ length: n }); }
  empty(n: number): number[] { return Array.from({ length: 5 - n }); }
}
