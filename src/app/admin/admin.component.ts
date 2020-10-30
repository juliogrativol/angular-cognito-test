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
  ) { }

  ngOnInit() {
    // console.log();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  newPassword(): void {
    this.router.navigate(['/newPassword']);
  }

  recoverCode(): void {
    this.router.navigate(['/recoverCode'])
  }


}