import { Component, OnInit } from '@angular/core';
import { UserService, AppUser } from '../../../core/api/user.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: AppUser[] = [];
  currentUserId: string | null = null;
  isLoading = true;

  isModalOpen = false;
  selectedUser: AppUser | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.currentUserValue?._id || null;
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.isLoading = false;
    });
  }
  onDeleteUser(userId: string): void {
    if (confirm('Sei sicuro di voler eliminare questo utente? L\'azione è irreversibile.')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.users = this.users.filter(user => user._id !== userId);
        alert('Utente eliminato con successo.');
      });
    }
  }

  openAddModal(): void {
    this.selectedUser = null;
    this.isModalOpen = true;
  }

  openEditModal(user: AppUser): void {
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  handleFormClose(result: AppUser | null): void {
    if (result) {
      this.loadUsers();
    }
    this.isModalOpen = false;
  }
}
