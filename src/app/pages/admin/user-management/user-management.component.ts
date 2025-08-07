import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService, AppUser } from '../../../core/api/user.service';
import { AuthService } from '../../../core/auth/auth.service';
import { UserFormComponent } from '../../../shared/user-form/user-form.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: AppUser[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  currentUserId: string | null = null;
  isLoading = true;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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

  openUserDialog(userToEdit: AppUser | null = null): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { userToEdit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (userToEdit) {
          this.userService.updateUser(userToEdit._id, result).subscribe(() => {
            this.snackBar.open('Utente aggiornato con successo', 'Chiudi', { duration: 3000 });
            this.loadUsers();
          });
        } else {
          this.userService.createUser(result).subscribe(() => {
            this.snackBar.open('Utente creato con successo', 'Chiudi', { duration: 3000 });
            this.loadUsers();
          });
        }
      }
    });
  }

  onDeleteUser(userId: string): void {
    if (confirm('Sei sicuro di voler eliminare questo utente?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.snackBar.open('Utente eliminato con successo', 'Chiudi', { duration: 3000 });
        this.loadUsers();
      });
    }
  }
}
