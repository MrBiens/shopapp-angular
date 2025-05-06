import { Injectable } from '@angular/core';

import {HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';

import{  Environment } from 'src/app/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister= Environment.apiUrl + "/users/register";
  private apiLogin= Environment.apiUrl + "/users/login"; 

  private headers ={ 
    headers :this.createHeaders()
  };

  constructor(private http: HttpClient) {
    
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
  register(registerDTO : RegisterDTO):Observable<any>{
   
    return this.http.post(this.apiRegister,registerDTO, this.headers);
 
  }

  login(loginDTO:LoginDTO):Observable<any>{
    return this.http.post(this.apiLogin,loginDTO,this.headers);
  }




}
