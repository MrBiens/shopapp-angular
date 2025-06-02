import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NotificationAllResponse } from 'src/app/dtos/notification/notification.common';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  notifications: NotificationAllResponse[] = [];

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {

    this.notificationService.getNotificationsCommon().subscribe({
      next: (data:NotificationAllResponse[]) => {
        this.notifications = data.map((n) => ({
          ...n,
          image: n.image ? this.notificationService.getImageNotification(n.image) : ''
        }));
      },
      error: (err) => console.error(err)
    });
  }

}
