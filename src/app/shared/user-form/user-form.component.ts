import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUser } from '../../core/api/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userToEdit: AppUser | null }
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['Operatore', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.userToEdit) {
      this.isEditMode = true;
      this.userForm.patchValue(this.data.userToEdit);
      this.userForm.get('password')?.clearValidators();
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  onSave(): void {
    if (this.userForm.invalid) return;
    this.dialogRef.close(this.userForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
