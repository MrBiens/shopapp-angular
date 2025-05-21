import {inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateFn
} from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() > 0;
    debugger;

    if (!isTokenExpired && isUserIdValid) {
      return true; // Cho phép đi tiếp
    } else {
      this.router.navigate(['/login']); // Chuyển hướng về trang đăng nhập
      return false;
    }
  }
}

export const AuthGuardFn : CanActivateFn = (
    next:ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean => {
    debugger;
    return inject(AuthGuard).canActivate(next,state);
}
