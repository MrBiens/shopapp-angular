import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

import { UserService } from "../services/user.service";
import { TokenService } from "../services/token.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getAccessToken();

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes("refresh-token")) {
          const refreshToken = this.tokenService.getRefreshToken();

          if (!refreshToken) {
            this.userService.logout();
            this.tokenService.removeAccessToken();
            return throwError(() => error);
          }

          return this.userService.refreshToken({ refreshToken }).pipe(
            switchMap((res) => {
              // Lưu lại token mới
              this.tokenService.setAccessToken(res.token);
              this.tokenService.setRefreshToken(res.refreshToken);

              const updatedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.token}`
                }
              });

              return next.handle(updatedReq);
            }),
            catchError((err) => {
              this.userService.logout();
              this.tokenService.removeAccessToken();
              return throwError(() => err);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
