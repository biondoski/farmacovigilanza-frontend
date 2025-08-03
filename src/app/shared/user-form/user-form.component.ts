import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, AppUser } from '../../core/api/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() userToEdit: AppUser | null = null;
  @Output() formClosed = new EventEmitter<AppUser | null>();

  userForm: FormGroup;
  isEditMode = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['Operatore', Validators.required]
    });
  }

  ngOnInit(): void {
    this.updateFormBasedOnMode();
  }

  ngOnChanges(): void {
    this.updateFormBasedOnMode();
  }

  updateFormBasedOnMode(): void {
    if (this.userToEdit) {
      this.isEditMode = true;
      this.userForm.patchValue(this.userToEdit);
      this.userForm.get('password')?.clearValidators();
    } else {
      this.isEditMode = false;
      this.userForm.reset({ role: 'Operatore' });
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const userData = this.userForm.value;

    if (this.isEditMode && this.userToEdit) {
      this.userService.updateUser(this.userToEdit._id, userData).subscribe(updatedUser => {
        this.isLoading = false;
        this.formClosed.emit(updatedUser);
      });
    } else {
      this.userService.createUser(userData).subscribe(newUser => {
        this.isLoading = false;
        this.formClosed.emit(newUser);
      });
    }
  }

  close(): void {
    this.formClosed.emit(null);
  }
}
