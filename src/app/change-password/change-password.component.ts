import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }


  passwordForm = this.fb.group({
    oldPassword: [''],
    newPassword: ['']
  });

  ngOnInit() {
  }

  changePassword(): void {
    const pass = this.passwordForm.getRawValue();
    const { idToken } = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
    this.authService.changePassword(pass.oldPassword, pass.newPassword, idToken.payload.email);
  }

}
