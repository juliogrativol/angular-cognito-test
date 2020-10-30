import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-recover-code',
  templateUrl: './recover-code.component.html',
  styleUrls: ['./recover-code.component.css']
})
export class RecoverCodeComponent implements OnInit {
  userEmail: string;
  onSuccess: boolean;
  code: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const info = JSON.parse(this.route.snapshot.paramMap.get('info'));
    this.userEmail = info;
  }

  async resendConfirmationCode(): Promise<any> {
    const resp = await this.authService.resendConfirmationCode(this.userEmail);
    if (resp) {
      this.onSuccess = true;
    }
  }

  async sendConfirmationCode(): Promise<any> {
    const userInfo = { userName: this.userEmail, codigo: this.code };
    const result = await this.authService.verifyCode(userInfo);
    this.router.navigate(['/login']);
  }

}
