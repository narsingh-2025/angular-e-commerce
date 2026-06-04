import { Routes } from '@angular/router';
import { HomeComponent }            from './components/home/home.component';
import { ShopComponent }            from './components/shop/shop.component';
import { ProductDetailComponent }   from './components/product-detail/product-detail.component';
import { BulkOrderComponent }       from './components/bulk-order/bulk-order.component';
import { FarmersMarketComponent }   from './components/farmers-market/farmers-market.component';
import { FarmerProfileComponent }   from './components/farmer-profile/farmer-profile.component';
import { CheckoutComponent }        from './components/checkout/checkout.component';
import { OrderConfirmComponent }    from './components/order-confirm/order-confirm.component';
import { DashboardLayoutComponent } from './components/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent }   from './components/dashboard/dashboard-home/dashboard-home.component';
import { CategoryListComponent }    from './components/dashboard/category-list/category-list.component';
import { CategoryFormComponent }    from './components/dashboard/category-form/category-form.component';
import { InquiryListComponent }     from './components/dashboard/inquiry-list/inquiry-list.component';
import { DashProductListComponent } from './components/dashboard/dash-product-list/dash-product-list.component';
import { DashProductFormComponent } from './components/dashboard/dash-product-form/dash-product-form.component';
import { OrderListComponent }       from './components/dashboard/order-list/order-list.component';
import { FarmerListComponent }      from './components/dashboard/farmer-list/farmer-list.component';
import { FarmerFormComponent }      from './components/dashboard/farmer-form/farmer-form.component';

export const routes: Routes = [
  { path: '',                    component: HomeComponent },
  { path: 'shop',                component: ShopComponent },
  { path: 'shop/product/:id',    component: ProductDetailComponent },
  { path: 'farmers',             component: FarmersMarketComponent },
  { path: 'farmers/:id',         component: FarmerProfileComponent },
  { path: 'bulk-order',          component: BulkOrderComponent },
  { path: 'checkout',            component: CheckoutComponent },
  { path: 'order-confirm/:id',   component: OrderConfirmComponent },
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
      { path: 'orders',              component: OrderListComponent },
      { path: 'farmers',             component: FarmerListComponent },
      { path: 'farmers/new',         component: FarmerFormComponent },
      { path: 'farmers/edit/:id',    component: FarmerFormComponent },
    ]
  },
  { path: '**', redirectTo: '' },
];
