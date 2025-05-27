import { Injectable } from "@angular/core";
import { Environment } from "../enviroments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { NotificationResponse } from "../dtos/notification/notification.response";

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
        return this.http.get<any>(`${this.apiNotifications}`, { params }).pipe(
            map(response => response.result as NotificationResponse[])
        );
    }
    
    getImageNotification(imageName: string): string {
        return `${this.apiNotifications}/images/${imageName}`;
    }

    
    createNotification(formData: FormData): Observable<NotificationResponse> {
        return this.http.post<any>(`${this.apiNotifications}`, formData).pipe(
            map(response => response.result as NotificationResponse)
        );
    }

    
    
    

}
