import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = true;

  constructor(private catSvc: CategoryService) {}

  ngOnInit(): void {
    this.catSvc.getAll().subscribe({ next: c => { this.categories = c; this.loading = false; } });
  }

  delete(id: string): void {
    if (!confirm('Delete this category?')) return;
    this.catSvc.delete(id).subscribe(() => this.categories = this.categories.filter(c => c._id !== id));
  }

  toggle(cat: Category): void {
    this.catSvc.update(cat._id!, { ...cat, isActive: !cat.isActive }).subscribe(updated => {
      const i = this.categories.findIndex(c => c._id === cat._id);
      if (i > -1) this.categories[i] = updated;
    });
  }
}
