import { NgForm } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../dtos/user/login.response';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    @ViewChild('loginForm') loginForm!: NgForm;
  
  phoneNumber: string = '';
  password: string = '';

  constructor(
    private router:Router,
    private userService: UserService,
    private tokenService: TokenService
  ) {

  }


onPhoneNumberChange(){
    console.log("Phone changed: ", this.phoneNumber);
  }

  login(){
    // gọi api đăng ký
    const loginDTO:LoginDTO  = {
        "phone_number": this.phoneNumber,
        "password": this.password,

    };

    this.userService.login(loginDTO).subscribe({
      next:(response:LoginResponse) => {
        

        debugger      
        const {token} = response;
        this.tokenService.setAccessToken(token);
      },  
      complete:() => {
        debugger
      },
      error:(error:any) => {
        debugger
        alert("Đăng nhập không thành công");
      }
    })

    
  }

}
