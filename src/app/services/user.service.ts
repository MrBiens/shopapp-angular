import { Injectable } from '@angular/core';

import {HttpClient,HttpHeaders, HttpParams} from '@angular/common/http';
import { map,Observable,BehaviorSubject } from 'rxjs';

import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';

import{  Environment } from 'src/app/enviroments/environment';
import { UserResponse } from '../dtos/user/user.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister= Environment.apiUrl + "/users/register";
  private apiLogin= Environment.apiUrl + "/users/login"; 
  private apiUserDetail=Environment.apiUrl+"/users/details";
  private apiSearchUsers=Environment.apiUrl+"/users/search-users";

  private userSubject = new BehaviorSubject<UserResponse | null>(this.getUserResponseFromLocalStorage());
  user$ = this.userSubject.asObservable(); // Để các component khác có thể subscribe và nhận thông tin người dùng


  private headers ={ 
    headers :this.createHeaders()
  };

  constructor(private http: HttpClient) {
    
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

  searchUsers(keyword:string,page:number, limit:number):Observable<any>{
        const params =  new HttpParams()
        .set('keyword', keyword)
        .set('page', page)
        .set('limit', limit);
        return this.http.get<any>(this.apiSearchUsers, { params: params }).pipe(
          map(response => response.result.userResponseList as UserResponse[] )
        );
  };

  register(registerDTO: RegisterDTO): Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, {
      headers: this.createHeaders()
    });
  }

  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post<any>(this.apiLogin, loginDTO, {
      headers: this.createHeaders()
    }).pipe(
      map(response => response.result.token)
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
    return this.http.post(this.apiUserDetail, {}, {
      headers: this.createHeaders(token)
    });
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
