import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationResponse } from 'src/app/dtos/notification/notification.response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-notification-admin',
  templateUrl: './notification.admin.component.html',
  styleUrls: ['./notification.admin.component.scss']
})
export class NotificationAdminComponent implements OnInit {
  notifications: NotificationResponse[] = [];
  page: number = 0;
  pageSize: number = 10;
  selectedImage!: File;
  loading = false;

  constructor(
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

 
  loadNotifications(): void {
  this.notificationService.getNotifications(this.page, this.pageSize).subscribe({
    next: data => {
      // map lại image thành URL đầy đủ
      this.notifications = data.map(n => ({
        ...n,
        image: n.image ? this.notificationService.getImageNotification(n.image) : ''
      }));
    },
    error: err => console.error(err)
  });
  
}





}