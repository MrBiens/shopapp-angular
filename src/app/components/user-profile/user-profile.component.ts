import { Component, OnInit } from '@angular/core';
import { UserResponse } from 'src/app/dtos/user/user.response';
import { UserUpdateRequest } from 'src/app/dtos/user/user.update';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent  implements OnInit{
  userResponse: UserResponse | null = null;
  isEditMode: boolean = false;


  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {
  } 
  ngOnInit(): void {
      this.getUserProfile();
  }
   getUserProfile(): void {
    const token = this.tokenService.getAccessToken();
    if (token) {
      this.userService.getUserDetail(token).subscribe({
        next: (response: any) => {
          const userFromServer = response.result;
          this.userResponse = {
            ...userFromServer,
            date_of_birth: new Date(userFromServer.date_of_birth)
          };
        },
        error: (error) => {
          console.error('Lỗi khi lấy thông tin user:', error);
        }
      });
    } else {
      console.warn('Không tìm thấy token trong localStorage');
    }
  }
  updateUserProfile(): void {
    if (!this.userResponse) return;

    const token = this.tokenService.getAccessToken();
    if (!token) {
      console.warn('Không tìm thấy token để cập nhật user');
      return;
    }

    const userUpdateRequest: UserUpdateRequest = {
      full_name: this.userResponse.full_name,
      phone_number: this.userResponse.phone_number,
      email: this.userResponse.email,
      date_of_birth: this.userResponse.date_of_birth,
      address: this.userResponse.address
    };

    this.userService.updateUser(this.userResponse.id, userUpdateRequest, token).subscribe({
      next: (updatedUser: UserResponse) => {
        this.userResponse = updatedUser;
        alert('Cập nhật thông tin thành công');
        console.log('Cập nhật thông tin thành công');
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật thông tin user:', err);
      }
    });
  }


}
