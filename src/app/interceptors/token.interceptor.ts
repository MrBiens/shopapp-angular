import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

import { TokenService } from "../services/token.service";
@Injectable()

export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService) { 

    }

    // dang ky interceptor trong module
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.tokenService.getAccessToken();
        if (accessToken) {
            // add token to request header
            req = req.clone({ // duppli request va sua doi
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        }
        return next.handle(req);
    }


    

}