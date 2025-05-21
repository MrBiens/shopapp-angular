import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Environment } from '../enviroments/environment';
import { Role } from '../models/role';
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiGetRoles  = `${Environment.apiUrl}/roles`;

  constructor(private http: HttpClient) { }
  getRoles():Observable<Role[]> {
    return this.http.get<any>(this.apiGetRoles).pipe(
      map( response => response.result as Role[])
    );
  }
}

