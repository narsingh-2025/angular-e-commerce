import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  navScrolled = false;
  menuOpen = false;
  contactForm!: FormGroup;
  contactSent = false;
  activeTestimonial = 0;

  stats = [
    { value: 500, suffix: '+', label: 'Products' },
    { value: 12, suffix: 'K+', label: 'Happy Customers' },
    { value: 8, suffix: '+', label: 'Years Experience' },
    { value: 99, suffix: '%', label: 'Satisfaction Rate' },
  ];

  animatedStats = this.stats.map(s => ({ ...s, current: 0 }));

  services = [
    { icon: '🚀', title: 'Fast Delivery', desc: 'Same-day dispatch on all in-stock items with real-time tracking.' },
    { icon: '🔒', title: 'Secure Payments', desc: 'End-to-end encrypted transactions with multi-layer fraud protection.' },
    { icon: '🛠️', title: 'Expert Support', desc: '24/7 technical support team ready to solve any issue instantly.' },
    { icon: '♻️', title: 'Easy Returns', desc: '30-day hassle-free return policy — no questions asked.' },
    { icon: '🌍', title: 'Global Shipping', desc: 'We ship to 120+ countries with competitive international rates.' },
    { icon: '💎', title: 'Premium Quality', desc: 'Every product is rigorously tested before reaching our warehouse.' },
  ];

  gallery = [
    { bg: 'linear-gradient(135deg,#667eea,#764ba2)', label: 'Electronics' },
    { bg: 'linear-gradient(135deg,#f093fb,#f5576c)', label: 'Accessories' },
    { bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', label: 'Office' },
    { bg: 'linear-gradient(135deg,#43e97b,#38f9d7)', label: 'Kitchen' },
    { bg: 'linear-gradient(135deg,#fa709a,#fee140)', label: 'Stationery' },
    { bg: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', label: 'Lifestyle' },
  ];

  testimonials = [
    { name: 'Sarah Johnson', role: 'Product Designer', avatar: 'SJ', stars: 5, text: 'Absolutely love the quality of every item I have ordered. The fast shipping and responsive support team make this my go-to store for everything tech-related.' },
    { name: 'Marcus Williams', role: 'Software Engineer', avatar: 'MW', stars: 5, text: 'I placed my first order skeptically, but the delivery was next-day and the keyboard I bought is exactly as described — perfect build quality. Will order again!' },
    { name: 'Priya Sharma', role: 'UX Researcher', avatar: 'PS', stars: 4, text: 'Great product range and super easy returns process. The website is smooth and the product descriptions are accurate. Highly recommend!' },
    { name: 'David Chen', role: 'Startup Founder', avatar: 'DC', stars: 5, text: 'We bulk order office supplies for our team of 40 regularly. Prices are competitive, volume discounts are real, and account management is excellent.' },
  ];

  partners = [
    { name: 'TechCorp', logo: 'TC' },
    { name: 'InnovateLab', logo: 'IL' },
    { name: 'FutureWorks', logo: 'FW' },
    { name: 'BuildBase', logo: 'BB' },
    { name: 'CloudSync', logo: 'CS' },
    { name: 'DataPulse', logo: 'DP' },
  ];

  team = [
    { name: 'Alex Morgan', role: 'CEO & Founder', avatar: 'AM', bg: 'linear-gradient(135deg,#667eea,#764ba2)', bio: 'Visionary leader with 15+ years in e-commerce and supply chain management.' },
    { name: 'Jessica Lee', role: 'Head of Products', avatar: 'JL', bg: 'linear-gradient(135deg,#f093fb,#f5576c)', bio: 'Former Google product lead passionate about curating the best customer experience.' },
    { name: 'Ryan Patel', role: 'CTO', avatar: 'RP', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', bio: 'Full-stack architect behind our lightning-fast delivery and inventory platform.' },
  ];

  navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Products', id: 'products' },
    { label: 'Team', id: 'team' },
    { label: 'Contact', id: 'contact' },
  ];

  constructor(private productService: ProductService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productService.getAll({ featured: true, limit: 6 }).subscribe({ next: (r) => this.products = r.products });
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
    setTimeout(() => this.animateStats(), 600);
    setInterval(() => { this.activeTestimonial = (this.activeTestimonial + 1) % this.testimonials.length; }, 4000);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.navScrolled = window.scrollY > 50;
  }

  scrollTo(id: string): void {
    this.menuOpen = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  animateStats(): void {
    this.animatedStats.forEach((stat, i) => {
      const target = this.stats[i].value;
      const step = Math.ceil(target / 60);
      const interval = setInterval(() => {
        stat.current = Math.min(stat.current + step, target);
        if (stat.current >= target) clearInterval(interval);
      }, 20);
    });
  }

  submitContact(): void {
    if (this.contactForm.invalid) return;
    this.contactSent = true;
    this.contactForm.reset();
  }

  private cat(p: Product): Category | null {
    return typeof p.category === 'object' ? p.category as Category : null;
  }
  getCatName(p: Product):  string { return this.cat(p)?.name  || 'General'; }
  getCatIcon(p: Product):  string { return this.cat(p)?.icon  || '📦'; }
  getCatColor(p: Product): string { return this.cat(p)?.color || '#4f46e5'; }
}
