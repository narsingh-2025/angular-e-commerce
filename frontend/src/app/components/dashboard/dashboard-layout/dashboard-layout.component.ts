import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
  navItems = [
    { label: 'Overview',   icon: '📊', route: '/dashboard' },
    { label: 'Orders',     icon: '🛒', route: '/dashboard/orders' },
    { label: 'Farmers',    icon: '🌾', route: '/dashboard/farmers' },
    { label: 'Products',   icon: '📦', route: '/dashboard/products' },
    { label: 'Categories', icon: '🗂️',  route: '/dashboard/categories' },
    { label: 'Inquiries',  icon: '📩', route: '/dashboard/inquiries' },
  ];
}
