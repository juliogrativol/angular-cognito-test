import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-new-password-required',
  templateUrl: './new-password-required.component.html',
  styleUrls: ['./new-password-required.component.css']
})
export class NewPasswordRequiredComponent implements OnInit {

  info: any;
  newPassword: string;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const { data } = this.route.snapshot.params;
    this.info = JSON.parse(atob(data));
  }

  sendNewPassword(): void {
    this.auth.completeNewPasswordChallenge(this.newPassword);
  }

}
