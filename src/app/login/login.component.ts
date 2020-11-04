import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { User } from '../user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  loginForm: FormGroup;
  isSubmitted = false;
  mensagemRetorno = "";

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern('')])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)])]
    });
  }

  get formControls() { return this.loginForm.controls; }

  async login() {
    this.mensagemRetorno = "";
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    await this.authService.login(this.loginForm.value)
      .then((result: any) => {
        if (result === "newPasswordRequired") {
          this.router.navigate(['/newPasswordRequired', { data: btoa(JSON.stringify(this.loginForm.getRawValue())) }]);
        } else {
          this.router.navigateByUrl('/admin');
        }
      }).catch(err => {
        if (err.message === 'User is not confirmed.') {
          this.router.navigate(['/recoverCode', { info: JSON.stringify(this.loginForm.value.email) }]);
        }
        this.mensagemRetorno = err.message;
      });
  }

  recuperarSenha(event: Event) {
    this.router.navigateByUrl('/recuperarSenha');
  }

  registrarUsuario(event: Event) {
    this.router.navigateByUrl('/newUser');
  }
  recoverCode(): void {
    this.router.navigate(['/recoverCode'])
  }
}
