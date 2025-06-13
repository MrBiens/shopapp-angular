import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangePasswordDTO } from 'src/app/dtos/user/change.password';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change.password',
  templateUrl: './change.password.component.html',
  styleUrls: ['./change.password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  changePasswordDTO: ChangePasswordDTO | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isFormValid = false;
  userId: number = 0;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
  }

  validateForm() {
    this.isFormValid =
      this.changePasswordForm.currentPassword.trim() !== '' &&
      this.changePasswordForm.newPassword.trim() !== '' &&
      this.changePasswordForm.confirmNewPassword.trim() !== '' &&
      this.changePasswordForm.newPassword === this.changePasswordForm.confirmNewPassword;

    console.log('isFormValid:', this.isFormValid); // Kiểm tra giá trị khi form thay đổi
  }

  changePassword() {
    this.validateForm();
    if (!this.isFormValid) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin và đảm bảo mật khẩu mới khớp với xác nhận mật khẩu.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const token = this.tokenService.getAccessToken();
    if (!token) {
      this.errorMessage = 'Không tìm thấy token để xác thực.';
      this.isLoading = false;
      return;
    }

    this.changePasswordDTO = {
      currentPassword: this.changePasswordForm.currentPassword,
      newPassword: this.changePasswordForm.newPassword
    };

    this.userService.changePassword(this.userId, this.changePasswordDTO, token).subscribe({
      next: () => {
        this.successMessage = 'Đổi mật khẩu thành công!';
        this.changePasswordForm = {
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        };
      },
      error: () => {
        this.errorMessage = 'Đổi mật khẩu thất bại. Vui lòng thử lại sau.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}