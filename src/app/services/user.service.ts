import { Injectable } from '@angular/core';

import {HttpClient,HttpHeaders, HttpParams} from '@angular/common/http';
import { map,Observable,BehaviorSubject } from 'rxjs';

import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';

import{  Environment } from 'src/app/enviroments/environment';
import { UserResponse } from '../dtos/user/user.response';
import { UserUpdateRequest } from '../dtos/user/user.update';
import { ChangePasswordDTO } from '../dtos/user/change.password';
import {  RefreshTokenDTO } from '../dtos/auth/refresh.token';
import { LoginResponse } from '../dtos/user/login.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister= Environment.apiUrl + "/users/register";
  private apiLogin= Environment.apiUrl + "/users/login"; 
  private socialLoginUrl = Environment.apiUrl + "/users/auth/social-login";
  private callbackUrl = Environment.apiUrl + "/users/auth/callback";
  private apiRefreshToken= Environment.apiUrl + "/users/refresh-token";
  private apiUserDetail=Environment.apiUrl+"/users/details";
  private apiSearchUsers=Environment.apiUrl+"/users/search-users";

  private userSubject = new BehaviorSubject<UserResponse | null>(this.getUserResponseFromLocalStorage());
  user$ = this.userSubject.asObservable(); 


  private headers ={ 
    headers :this.createHeaders()
  };

  constructor(private http: HttpClient) {
    
  }
  getGoogleLoginUrl(): Observable<string> {
    const params = new HttpParams().set("login_type", "google");
    return this.http.get(this.socialLoginUrl, { params, responseType: 'text' }); // server trả về URL dạng string
  }

  handleCallback(code: string, login_type: string): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('code', code)
      .set('login_type', login_type);

    return this.http.get<any>(this.callbackUrl, { params }).pipe(
      map(response => ({
        token: response.result.token,
        refreshToken: response.result.refresh_token 
      }))
    );
  }

  

 private createHeaders(token?: string): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  searchUsers(keyword: string, page: number, limit: number): Observable<{ users: UserResponse[], totalPages: number }> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('limit', limit);

    return this.http.get<any>(this.apiSearchUsers, { params }).pipe(
      map(response => ({
        users: response.result.userResponseList as UserResponse[],
        totalPages : response.result.totalPage
      }))
    );
  }

  register(registerDTO: RegisterDTO): Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, {
      headers: this.createHeaders()
    });
  }

  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post<any>(this.apiLogin, loginDTO, {
      headers: this.createHeaders()
    }).pipe(
      map(response => {
            return {
                token: response.result.token,
                refreshToken: response.result.refresh_token,
            };
        })
    );
  }
  refreshToken(refreshToken: RefreshTokenDTO): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${this.apiRefreshToken}`, { refreshToken }, { headers }).pipe(
      map(response => {
        return {
          token: response.result.token,
          refreshToken: response.result.refresh_token,
        };
      })
    );
  }

  logout():void{
    try{
      localStorage.removeItem('user');
      console.log('User data removed from local storage')
    }catch(error){
      console.error(`User data cannot removed from local storage: ${error}`)
    }
  }

  getUserDetail(token: string): Observable<any> {
    return this.http.get(this.apiUserDetail,  {
      headers: this.createHeaders(token)
    });
  }
  
  updateUser(userId: number, userUpdateRequest: UserUpdateRequest, token: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUserDetail}/${userId}`,
      userUpdateRequest,
      { headers:this.createHeaders(token) }
    )
  }
  changePassword(userId: number, changePassword:ChangePasswordDTO, token: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUserDetail}/${userId}/change-password`,
      changePassword,
      { headers:this.createHeaders(token) }
    ) 
  }     
  

  saveUserResponseToLocalStorage(userResponse?:UserResponse){
    try{
      debugger;
      if(userResponse == null ||!userResponse){
        return;
      }
      const userResponseJSON=JSON.stringify(userResponse);
      localStorage.setItem('user',userResponseJSON);
      this.userSubject.next(userResponse); // Cập nhật giá trị trong BehaviorSubject


      console.log('User response saved to local storage');
    }catch(error){
      console.error('Error saveing user response to local storage',error);
    }
  }

  getUserResponseFromLocalStorage():UserResponse | null{
    try{
      const userResponseJSON = localStorage.getItem('user');
      if(userResponseJSON == null || userResponseJSON == undefined){
        return null;
      }
      const userResponse = JSON.parse(userResponseJSON!);
      console.log('User response retrieved from local storage');
      return userResponse;
    }catch(error){
      console.error('Error retrieving user response from local stogare');
      return null;
    }
  }






}
