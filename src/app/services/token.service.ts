import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable({
    providedIn: 'root'
})

export class TokenService{
    private readonly ACCESS_TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN= 'refresh_token';
    private jwtHelperService = new JwtHelperService();

    constructor() { 

    }
    //console: localStorage.getItem('access_token')

    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    setAccessToken(token: string): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN);
    }   
    setRefreshToken(token: string): void {
        localStorage.setItem(this.REFRESH_TOKEN, token);    
    }
    removeAccessToken(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    }
    removeRefreshToken(): void {
        localStorage.removeItem(this.REFRESH_TOKEN);
    }

    getUserId():number{
        let userObject = this.jwtHelperService.decodeToken(this.getAccessToken()??'');
        return 'userId' in userObject?parseInt(userObject['userId']):0;
    }
    
    getFullName(): string {
        const userJson = localStorage.getItem('user');
        if (!userJson) return '';
        
        try {
            const user = JSON.parse(userJson);
            return user.full_name || '';
        } catch (e) {
            console.error('Error parsing user from localStorage', e);
            return '';
        }
    }

    isTokenExpired():boolean{
        if(this.getAccessToken()==null){
            return false;
        }
        return this.jwtHelperService.isTokenExpired(this.getAccessToken()!);
    }
    
    

}