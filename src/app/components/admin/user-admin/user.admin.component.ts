import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from 'src/app/dtos/user/user.response';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user.admin.component.html',
  styleUrls: ['./user.admin.component.scss']
})
export class UserAdminComponent implements OnInit {

  users: UserResponse[] = [];
  keyword: string = '';
  page: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  visiblePages: number[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchUsers();
  }

  searchUsers(): void {
    this.userService.searchUsers(this.keyword, this.page, this.limit).subscribe({
      next: (data) => {
        this.users = data.users;
        this.totalPages = data.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.page, this.totalPages);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  goToEditUser(id: number): void {
    this.router.navigate(['/admin/users/edit', id]);
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.searchUsers();
    }
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const pageCount = 5;
    let startPage = Math.max(1, currentPage - Math.floor(pageCount / 2));
    let endPage = Math.min(totalPages, startPage + pageCount - 1);

    if (endPage - startPage + 1 < pageCount) {
      startPage = Math.max(1, endPage - pageCount + 1);
    }

    if (totalPages === 0 || endPage < startPage) return [];
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
}
