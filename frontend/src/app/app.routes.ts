import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { BulkOrderComponent } from './components/bulk-order/bulk-order.component';
import { DashboardLayoutComponent } from './components/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './components/dashboard/dashboard-home/dashboard-home.component';
import { CategoryListComponent } from './components/dashboard/category-list/category-list.component';
import { CategoryFormComponent } from './components/dashboard/category-form/category-form.component';
import { InquiryListComponent } from './components/dashboard/inquiry-list/inquiry-list.component';
import { DashProductListComponent } from './components/dashboard/dash-product-list/dash-product-list.component';
import { DashProductFormComponent } from './components/dashboard/dash-product-form/dash-product-form.component';

export const routes: Routes = [
  { path: '',           component: HomeComponent },
  { path: 'shop',       component: ShopComponent },
  { path: 'shop/product/:id', component: ProductDetailComponent },
  { path: 'bulk-order', component: BulkOrderComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '',                    component: DashboardHomeComponent },
      { path: 'categories',          component: CategoryListComponent },
      { path: 'categories/new',      component: CategoryFormComponent },
      { path: 'categories/edit/:id', component: CategoryFormComponent },
      { path: 'products',            component: DashProductListComponent },
      { path: 'products/new',        component: DashProductFormComponent },
      { path: 'products/edit/:id',   component: DashProductFormComponent },
      { path: 'inquiries',           component: InquiryListComponent },
    ]
  },
  { path: '**', redirectTo: '' },
];
