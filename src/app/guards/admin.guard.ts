import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateFn
} from '@angular/router';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { UserResponse } from '../dtos/user/user.response';

@Injectable({ providedIn: 'root' })
export class AdminGuard  {
    userResponse?:UserResponse | null;

  constructor(
    private tokenService: TokenService, 
    private router: Router,
    private userService:UserService
) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() > 0;
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    const isAdmin = this.userResponse?.role_response.name == 'ADMIN';

    debugger;

    if (!isTokenExpired && isUserIdValid && isAdmin) {
      return true; // Cho phép đi tiếp
    } else {
      this.router.navigate(['/login']); // Chuyển hướng về trang đăng nhập
      return false;
    }
  }

}

export const AdminGuardFn : CanActivateFn = (
    next:ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean => {
    debugger;
    return inject(AdminGuard).canActivate(next,state);
}

