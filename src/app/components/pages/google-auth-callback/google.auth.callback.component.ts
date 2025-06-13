import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-google-auth-callback',
  template: `<p>Đang xử lý đăng nhập Google...</p>`
})
export class GoogleAuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const loginType = 'google'; // 👈 bạn cần gắn giá trị login_type tại đây
      
      if (!code || !loginType) {
        alert('Thiếu thông tin xác thực!');
        this.router.navigate(['/login']);
        return;
      }

      if (code) {
        this.userService.handleCallback(code,loginType).subscribe({
          next: (response: any) => {
            const { token, refreshToken  } = response;
            this.tokenService.setAccessToken(token);
            this.tokenService.setRefreshToken(refreshToken );

            this.userService.getUserDetail(token).subscribe({
              next: (userResponseServer: any) => {
                const userResponse = {
                  ...userResponseServer.result,
                  date_of_birth: new Date(userResponseServer.result.date_of_birth)
                };

                this.userService.saveUserResponseToLocalStorage(userResponse);
                if (userResponse.role_response.name === 'ADMIN') {
                  this.router.navigate(['/admin']).then(() => window.location.reload());
                } else {
                  this.router.navigate(['/']).then(() => window.location.reload());
                }
              }
            });
          },
          complete: () => {
            alert('Đăng nhập Google thành công!');
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Google login failed:', err);
            alert("Đăng nhập Google thất bại");
            this.router.navigate(['/login']);
          }
        });
      } else {
        alert('Không tìm thấy mã xác thực từ Google!');
        this.router.navigate(['/login']);
      }
    });
  }
}
