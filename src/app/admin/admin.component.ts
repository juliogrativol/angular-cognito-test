import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  passwordForm = this.fb.group({
    oldPassword: [''],
    newPassword: ['']
  });

  ngOnInit() {
    // console.log();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  changePassword(): void {
    const pass = this.passwordForm.getRawValue();
    const { payload } = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
    this.authService.changePassword(pass.oldPassword, pass.newPassword, payload.email);
  }
}