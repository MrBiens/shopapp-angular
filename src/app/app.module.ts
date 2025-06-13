import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { OrderComponent } from './components/order/order.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderConfirmComponent } from './components/order-detail/order.detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import{ 
  HTTP_INTERCEPTORS, 
  HttpClientModule,
} from '@angular/common/http'; // import HttpClientModule to use HttpClient
import { TokenInterceptor } from './interceptors/token.interceptor'; // import interceptor
import { AppRoutingModule } from './app.routing.module'; // <- THÊM DÒNG NÀY
import { AppComponent } from './app.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminComponent } from './components/admin/admin.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { OrderAdminComponent } from './components/admin/order-admin/order.admin.component';
import { DetailOrderAdminComponent } from './components/admin/detail-order.admin/detail.order.admin.component';
import { InvoicePrintComponent } from './components/admin/invoice-print.admin/invoice.print.admin.component';
import { ProductAdminComponent } from './components/admin/product-admin/product.admin.component';
import { CategoryAdminComponent } from './components/admin/category-admin/category.admin.component';
import { InsertCategoryAdminComponent } from './components/admin/category-admin/insert/insert.category.admin.component';
import { UpdateCategoryAdminComponent } from './components/admin/category-admin/update/update.category.admin.component';
import { UpdateProductAdminComponent } from './components/admin/product-admin/update/update.product.admin.component';
import { InsertProductAdminComponent } from './components/admin/product-admin/insert/insert.product.admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { PurchaseInvoiceDetailAdminComponent } from './components/admin/purchase.invoice-admin/update/purchase.invoice.detail.admin.component';
import { PurchaseInvoiceAdminComponent } from './components/admin/purchase.invoice-admin/purchase.invoice-admin.component';
import { InsertPurchaseInvoiceAdminComponent } from './components/admin/purchase.invoice-admin/insert/insert.purchase.invoice.admin.component';
import { SupplierAdminComponent } from './components/admin/supplier-admin/supplier.admin.component';
import { CouponAdminComponent } from './components/admin/coupon-admin/coupon.admin.component';
import { NotificationAdminComponent } from './components/admin/notification-admin/notification.admin.component';
import { UpdateCouponAdminComponent } from './components/admin/coupon-admin/update/update.coupon.admin.component';
import { InsertNotificationAdminComponent } from './components/admin/notification-admin/insert/insert.notification.admin.component';
import { UpdateNotificationAdminComponent } from './components/admin/notification-admin/update/update.notification.admin.component';
import { InsertCouponAdminComponent } from './components/admin/coupon-admin/insert/insert.coupon.admin.component';
import { InsertSupplierAdminComponent } from './components/admin/supplier-admin/insert/insert.supplier.admin.component';
import { UpdateSupplierAdminComponent } from './components/admin/supplier-admin/update/update.supplier.admin.component';
import { NotificationComponent } from './components/notification/notification.component';
import { BannerAdminComponent } from './components/admin/banner-admin/banner.admin.component';
import { InsertBannerAdminComponent } from './components/admin/banner-admin/insert/insert.banner.admin.component';
import { UpdateBannerAdminComponent } from './components/admin/banner-admin/update/update.banner.admin.component';
import { SearchComponent } from './components/search/search.component';
import { UserAdminComponent } from './components/admin/user-admin/user.admin.component';
import { UpdateUserAdminComponent } from './components/admin/user-admin/update/update.user.admin.component';
import { InsertOrderAdminComponent } from './components/admin/order-admin/insert/insert.order.admin.component';
import { UpdateOrderAdminComponent } from './components/admin/order-admin/update/update.order.admin.component';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChangePasswordComponent } from './components/user-profile/change-password/change.password.component';
import { OrderHistoryComponent } from './components/history-order/history.order.component';
import { NotificationUserComponent } from './components/notification-user/notification.user.component';
import { PurchaseDetailComponent } from './components/admin/purchase.invoice-admin/detail/detail.component';
import { GoogleAuthCallbackComponent } from './components/pages/google-auth-callback/google.auth.callback.component';

@NgModule({
  declarations: [
    AdminComponent,
    AppComponent,
    HomeComponent, 
    HeaderComponent,
    FooterComponent,
    OrderComponent, 
    SearchComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    OrderHistoryComponent,
    DetailProductComponent, 
    OrderConfirmComponent, 
    LoginComponent, 
    GoogleAuthCallbackComponent,
    RegisterComponent,
    SidebarComponent,
    NotificationUserComponent,

    DetailOrderAdminComponent,
    InvoicePrintComponent,

    ProductAdminComponent,
    UpdateProductAdminComponent,
    InsertProductAdminComponent,

    CategoryAdminComponent,
    InsertCategoryAdminComponent,
    UpdateCategoryAdminComponent,
    
    PurchaseInvoiceAdminComponent,
    PurchaseDetailComponent,
    InsertPurchaseInvoiceAdminComponent,
    PurchaseInvoiceDetailAdminComponent,

    SupplierAdminComponent,
    InsertSupplierAdminComponent,
    UpdateSupplierAdminComponent,


    CouponAdminComponent,
    InsertCouponAdminComponent,
    UpdateCouponAdminComponent,

    NotificationAdminComponent,
    InsertNotificationAdminComponent,
    UpdateNotificationAdminComponent,


    NotificationComponent,

    BannerAdminComponent,
    InsertBannerAdminComponent,
    UpdateBannerAdminComponent,

    UserAdminComponent,
    UpdateUserAdminComponent,

    OrderAdminComponent,
  
    InsertOrderAdminComponent,
    UpdateOrderAdminComponent,

    DashboardComponent

    
  ],

  imports: [
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule, // <- VÀ DÒNG NÀY,
    NgbDropdownModule, 
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgChartsModule

  ],

  providers: [
    { //Đăng ký Interceptor
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true, //  là bắt buộc để Angular biết đang thêm một interceptor mới chứ không thay thế interceptor mặc định.
    }
  ],
  bootstrap: [ 
    //bootstrap the main component of the application
    // HomeComponent,
    // DetailProductComponent,
    // OrderComponent,
    // OrderConfirmComponent,
    // LoginComponent,
    // RegisterComponent
    AppComponent // <- THAY THẾ BẰNG APPComponent
  ]

})
export class AppModule { }