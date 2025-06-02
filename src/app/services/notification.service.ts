import { Injectable } from "@angular/core";
import { Environment } from "../enviroments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { NotificationResponse } from "../dtos/notification/notification.response";
import { NotificationAllResponse } from "../dtos/notification/notification.common";

@Injectable({
providedIn:'root'  
})
export class NotificationService {
    private apiNotifications = Environment.apiUrl+'/notifications';

    constructor(
        private http: HttpClient
    ) {
    }

    getNotifications(page: number, pageSize: number): Observable<NotificationResponse[]> {
        const params = {    
            page: page.toString(),
            pageSize: pageSize.toString()
        };
        return this.http.get<any>(`${this.apiNotifications}/admin`, { params }).pipe(
            map(response => response.result as NotificationResponse[])
        );
    }
    createNotification(formData: FormData): Observable<NotificationResponse> {
        return this.http.post<any>(`${this.apiNotifications}`, formData).pipe(
            map(response => response.result as NotificationResponse)
        );
    }

    getNotificationsCommon(): Observable<any> {
        return this.http.get<any>(`${this.apiNotifications}/common`).pipe(
            map(response => response.result as NotificationAllResponse[])
        );
    }
    
    getImageNotification(imageName: string): string {
        return `${this.apiNotifications}/images/${imageName}`;
    }

    
  

    
    
    

}
