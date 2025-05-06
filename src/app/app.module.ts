import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { OrderComponent } from './components/order/order.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderConfirmComponent } from './components/order-confirm/order-confirm.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { FormsModule } from '@angular/forms';

import{ 
  HTTP_INTERCEPTORS, 
  HttpClientModule,
} from '@angular/common/http'; // import HttpClientModule to use HttpClient
import { TokenInterceptor } from './interceptors/token.interceptor'; // import interceptor
import { AppRoutingModule } from './app.routing.module'; // <- THÊM DÒNG NÀY
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    HeaderComponent,
    FooterComponent,
    OrderComponent, 
    DetailProductComponent, 
    OrderConfirmComponent, 
    LoginComponent, 
    RegisterComponent,
    
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule // <- VÀ DÒNG NÀY

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