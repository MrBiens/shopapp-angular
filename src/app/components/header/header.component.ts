import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from 'src/app/dtos/user/user.response';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  userResponse?:UserResponse | null;
  isPopoverOpen = false;
  activeNavItem : number = 0;


  constructor(
    private router:Router,
    private userService:UserService,
    private tokenService:TokenService
  ){

  }

  ngOnInit(): void {
    // Đăng ký (subscribe) vào user$ để nhận thông tin người dùng mỗi khi nó thay đổi
    this.userService.user$.subscribe((userResponse) => {
      this.userResponse = userResponse; // Cập nhật giá trị userResponse khi có sự thay đổi
    });
  }



  goToLogin(): void {
    this.router.navigate(['login']); // Điều hướng đến trang chi tiết sản phẩm
  }
  goToNotification(): void {
    this.router.navigate(['/notification']);
  }

  
  handleUserMenu(option: number): void {
  switch (option) {
    case 0:
      this.router.navigate(['/user/profile']);
      break;
    case 1:
      this.router.navigate(['/order-history']);
      break;
    case 2:
      this.router.navigate(['/notification-user']);
      break;
    case 3:
      this.userService.logout();
      this.tokenService.removeAccessToken();
      this.tokenService.removeRefreshToken();
      this.userResponse = null; // Đặt lại userResponse thành null
      this.router.navigate(['/login']);
      break;
    default:
      break;
    }
  }

  setActiveNavItem(index : number){
    this.activeNavItem=index;
  }


}
