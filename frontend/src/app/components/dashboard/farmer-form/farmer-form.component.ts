import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FarmerService } from '../../../services/farmer.service';

@Component({
  selector: 'app-farmer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './farmer-form.component.html',
  styleUrl: './farmer-form.component.scss'
})
export class FarmerFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  farmerId = '';
  loading = false;
  error = '';
  colorOptions = ['#10b981','#f59e0b','#3b82f6','#8b5cf6','#ec4899','#ef4444','#06b6d4','#84cc16'];

  constructor(private fb: FormBuilder, private svc: FarmerService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:           ['', Validators.required],
      farmName:       ['', Validators.required],
      phone:          ['', Validators.required],
      email:          [''],
      location:       ['', Validators.required],
      state:          [''],
      description:    [''],
      coverColor:     ['#10b981'],
      specialities:   [''],
      certifications: [''],
      isOrganic:      [false],
      isVerified:     [false],
      yearsActive:    [1],
      isActive:       [true],
    });

    this.farmerId = this.route.snapshot.params['id'];
    if (this.farmerId) {
      this.isEdit = true;
      this.svc.getAllAdmin().subscribe(farmers => {
        const f = farmers.find(x => x._id === this.farmerId);
        if (f) this.form.patchValue({ ...f, specialities: f.specialities?.join(', '), certifications: f.certifications?.join(', ') });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const raw = { ...this.form.value };
    raw.specialities   = raw.specialities   ? raw.specialities.split(',').map((s: string) => s.trim()).filter(Boolean)   : [];
    raw.certifications = raw.certifications ? raw.certifications.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

    const op = this.isEdit ? this.svc.update(this.farmerId, raw) : this.svc.create(raw);
    op.subscribe({
      next: () => this.router.navigate(['/dashboard/farmers']),
      error: err => { this.error = err.error?.message || 'Save failed.'; this.loading = false; }
    });
  }
}
