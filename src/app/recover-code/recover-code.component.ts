import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recover-code',
  templateUrl: './recover-code.component.html',
  styleUrls: ['./recover-code.component.css']
})
export class RecoverCodeComponent implements OnInit {
  userEmail: string;
  onSuccess: boolean;
  code: string;
  message: string;

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

  sendConfirmationCode(): void {
    const userInfo = { email: this.userEmail, codigo: this.code };
    this.authService.verifyCode(userInfo).then(
      (result: string) => {
        this.message = 'Código validado com sucesso';
        setTimeout(() => this.router.navigate(['/login'])
          , 2000);
      }
    );
  }

}
