import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../dtos/user/login.response';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { UserResponse } from 'src/app/dtos/user/user.response';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/models/role';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
   @ViewChild('loginForm') loginForm!: NgForm;
  
  userName: string = '';
  password: string = '';

  rememberMe:boolean=true;

  roles: Role[] = []; // Mảng roles
  userResponse?:UserResponse;

  constructor(
    private router:Router,
    private userService: UserService,
    private tokenService: TokenService,

  ) {

  }

  ngOnInit(): void {
    const user = this.userService.getUserResponseFromLocalStorage();
    if (user) {
      // Nếu đã đăng nhập, chuyển hướng theo role
      if (user.role_response.name === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    }
    
  }

  createAccount(){
    this.router.navigate(['/register']);
  }
  loginWithGoogle() {
    this.userService.getGoogleLoginUrl().subscribe({
      next: (url: string) => {
        window.location.href = url; // Redirect tới Google login page
      },
      error: (err) => {
        console.error('Error getting Google login URL', err);
        alert('Lỗi khi kết nối với Google!');
      }
    });
  }




  login(){
    // gọi api đăng ký
    const loginDTO:LoginDTO  = {
        "user_name": this.userName,
        "password": this.password,

    };

    this.userService.login(loginDTO).subscribe({
      next:(response:any) => {
        

        debugger      
        const { token, refreshToken, } = response;
        if(this.rememberMe){
          this.tokenService.setAccessToken(token);
          this.tokenService.setRefreshToken(refreshToken);
          this.userService.getUserDetail(token).subscribe({
          next:(response :any ) => {
              let userResponseSever = response.result;
              debugger;

              const userResponse ={
                ...userResponseSever,
                date_of_birth: new Date(userResponseSever.date_of_birth)
              }
              this.userService.saveUserResponseToLocalStorage(userResponse);
              this.userResponse=userResponse;

              alert("Đăng nhập thành công: " + this.userResponse?.full_name);

              if(this.userResponse?.role_response.name == 'ADMIN'){
                this.router.navigate(['admin']).then(() => {
                  window.location.reload();
                });
              }else if (this.userResponse?.role_response.name=='USER'){
                this.router.navigate(['/']).then(() => {
                  window.location.reload();
                });             
              }


          },
          complete:() => {
              debugger;
          },
          error:(error:any)=> {
              debugger;
          },
        })
        }
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
