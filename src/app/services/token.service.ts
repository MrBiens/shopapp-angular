import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class TokenService{
    private readonly ACCESS_TOKEN_KEY = 'access_token';
    constructor() { 

    }

    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    setAccessToken(token: string): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
    removeAccessToken(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    }
    

}