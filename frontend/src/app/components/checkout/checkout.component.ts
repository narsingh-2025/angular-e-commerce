import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';
  step = 1; // 1=details, 2=review, 3=payment

  get subtotal(): number { return this.cartSvc.total; }
  get tax():      number { return Math.round(this.subtotal * 0.05); }
  get shipping(): number { return this.subtotal > 5000 ? 0 : 99; }
  get total():    number { return this.subtotal + this.tax + this.shipping; }

  constructor(
    private fb: FormBuilder,
    public cartSvc: CartService,
    private orderSvc: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.cartSvc.isEmpty) { this.router.navigate(['/shop']); return; }
    this.form = this.fb.group({
      name:    ['', Validators.required],
      email:   ['', [Validators.required, Validators.email]],
      phone:   ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      address: ['', Validators.required],
      city:    ['', Validators.required],
      state:   ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  nextStep(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.step = 2;
  }

  placeOrder(): void {
    this.loading = true;
    this.error   = '';

    const orderData = {
      customer: this.form.value,
      items: this.cartSvc.items.map(i => ({
        productId:   i.productId,
        productName: i.name,
        price:       i.price,
        quantity:    i.quantity,
        unit:        i.unit,
        subtotal:    i.price * i.quantity,
      })),
      subtotal:  this.subtotal,
      tax:       this.tax,
      shipping:  this.shipping,
      total:     this.total,
    };

    this.orderSvc.createPayment(this.total).subscribe({
      next: (rp) => {
        if (rp.keyId && rp.keyId !== 'rzp_test_REPLACE_ME' && rp.orderId) {
          this.openRazorpay(rp, orderData);
        } else {
          // COD / test mode — save order directly
          this.orderSvc.verifyAndSave({ orderData }).subscribe({
            next: (order) => { this.cartSvc.clear(); this.router.navigate(['/order-confirm', order._id]); },
            error: () => { this.error = 'Order failed. Please try again.'; this.loading = false; }
          });
        }
      },
      error: () => { this.error = 'Payment init failed.'; this.loading = false; }
    });
  }

  private openRazorpay(rp: any, orderData: any): void {
    const options = {
      key:        rp.keyId,
      amount:     rp.amount,
      currency:   rp.currency || 'INR',
      name:       'FarmDirect',
      description:'Order Payment',
      order_id:   rp.orderId,
      prefill: {
        name:    this.form.value.name,
        email:   this.form.value.email,
        contact: this.form.value.phone,
      },
      theme: { color: '#4f46e5' },
      handler: (response: any) => {
        this.orderSvc.verifyAndSave({
          razorpayOrderId:   rp.orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          orderData,
        }).subscribe({
          next: (order) => { this.cartSvc.clear(); this.router.navigate(['/order-confirm', order._id]); },
          error: () => { this.error = 'Payment verification failed.'; this.loading = false; }
        });
      },
      modal: { ondismiss: () => { this.loading = false; } }
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }
}
