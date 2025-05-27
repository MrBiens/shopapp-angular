import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderConfirmComponent } from './components/order-detail/order.detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AdminGuard } from './guards/admin.guard';
import { OrderAdminComponent } from './components/admin/order-admin/order.admin.component';
import { CategoryAdminComponent } from './components/admin/category-admin/category.admin.component';
import { ProductAdminComponent } from './components/admin/product-admin/product.admin.component';
import { DetailOrderAdminComponent } from './components/admin/detail-order.admin/detail.order.admin.component';
import { InvoicePrintComponent } from './components/admin/invoice-print.admin/invoice.print.admin.component';
import { UpdateCategoryAdminComponent } from './components/admin/category-admin/update/update.category.admin.component';
import { InsertCategoryAdminComponent } from './components/admin/category-admin/insert/insert.category.admin.component';
import { UpdateProductAdminComponent } from './components/admin/product-admin/update/update.product.admin.component';
import { InsertProductAdminComponent } from './components/admin/product-admin/insert/insert.product.admin.component';
import { PurchaseInvoiceDetailAdminComponent } from './components/admin/purchase.invoice-admin/update/purchase.invoice.detail.admin.component';
import { PurchaseInvoiceAdminComponent } from './components/admin/purchase.invoice-admin/purchase.invoice-admin.component';
import { InsertPurchaseInvoiceAdminComponent } from './components/admin/purchase.invoice-admin/insert/insert.purchase.invoice.admin.component';
import { SupplierAdminComponent } from './components/admin/supplier-admin/supplier.admin.component';
import { CouponAdminComponent } from './components/admin/coupon-admin/coupon.admin.component';
import { NotificationAdminComponent } from './components/admin/notification-admin/notification.admin.component';
import { InsertNotificationAdminComponent } from './components/admin/notification-admin/insert/insert.notification.admin.component';
import { UpdateNotificationAdminComponent } from './components/admin/notification-admin/update/update.notification.admin.component';
import { InsertCouponAdminComponent } from './components/admin/coupon-admin/insert/insert.coupon.admin.component';
import { UpdateCouponAdminComponent } from './components/admin/coupon-admin/update/update.coupon.admin.component';
import { InsertSupplierAdminComponent } from './components/admin/supplier-admin/insert/insert.supplier.admin.component';
import { UpdateSupplierAdminComponent } from './components/admin/supplier-admin/update/update.supplier.admin.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'productdetail/:id', component: DetailProductComponent },
  { path: 'order', component: OrderComponent,canActivate:[AuthGuard] },
  { path: 'user/profile',component:UserProfileComponent,canActivate:[AuthGuard]},
  { path: 'order-confirm', component: OrderConfirmComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
  path: 'admin',
  component: AdminComponent,
  canActivate: [AdminGuard],
  children: [
    { path: 'orders', component: OrderAdminComponent },
    { path: 'orders/:id', component: DetailOrderAdminComponent }, 
    { path: 'orders/:id/invoice', component: InvoicePrintComponent },

    { path: 'categories', component: CategoryAdminComponent },
    { path: 'categories/insert', component: InsertCategoryAdminComponent },
    { path: 'categories/update/:id', component: UpdateCategoryAdminComponent },

    { path: 'products', component: ProductAdminComponent },
    { path: 'products/update/:id', component: UpdateProductAdminComponent },
    { path: 'products/create', component: InsertProductAdminComponent },

    { path: 'purchase_invoice', component: PurchaseInvoiceAdminComponent },
    { path: 'purchase_invoice/create', component: InsertPurchaseInvoiceAdminComponent },
    { path: 'purchase_invoice_detail', component: PurchaseInvoiceDetailAdminComponent },


    { path: 'suppliers', component: SupplierAdminComponent },
    { path: 'suppliers/create', component: InsertSupplierAdminComponent },
    { path: 'suppliers/edit/:id', component: UpdateSupplierAdminComponent },

    { path: 'coupons', component: CouponAdminComponent},
    { path: 'coupons/create', component: InsertCouponAdminComponent},
    { path: 'coupons/update/:id', component: UpdateCouponAdminComponent},

    { path: 'notifications', component: NotificationAdminComponent},
    { path: 'notifications/create', component: InsertNotificationAdminComponent},
    { path: 'notifications/update/:id', component: UpdateNotificationAdminComponent}






  ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
