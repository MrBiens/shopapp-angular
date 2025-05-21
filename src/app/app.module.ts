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
import { PurchaseInvoiceAdminComponent } from './components/admin/purchase.invoice-admin/purchase.invoice.admin.component';
import { PurchaseInvoiceDetailAdminComponent } from './components/admin/purchase.invoice.detail-admin/purchase.invoice.detail.admin.component';

@NgModule({
  declarations: [
    AdminComponent,
    AppComponent,
    HomeComponent, 
    HeaderComponent,
    FooterComponent,
    OrderComponent, 
    DetailProductComponent, 
    OrderConfirmComponent, 
    LoginComponent, 
    RegisterComponent,
    SidebarComponent,
    OrderAdminComponent,
    DetailOrderAdminComponent,
    InvoicePrintComponent,
    ProductAdminComponent,
    UpdateProductAdminComponent,
    InsertProductAdminComponent,
    CategoryAdminComponent,
    InsertCategoryAdminComponent,
    UpdateCategoryAdminComponent,
    PurchaseInvoiceAdminComponent,
    PurchaseInvoiceDetailAdminComponent

    
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