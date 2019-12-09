import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-recover',
  templateUrl: './password-recover.component.html',
  styleUrls: ['./password-recover.component.css']
})
export class PasswordRecoverComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  passwordRecoverForm: FormGroup;
  isSubmitted = false;
  mensagemRetorno = "";
  isValidating = false;

  ngOnInit() {
    this.passwordRecoverForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  habiblitaVerificacaoCodigo() {
    if (this.isValidating) {
      this.passwordRecoverForm = this.formBuilder.group({
        codigo: ['', Validators.required],
        newPassword: ['', Validators.required]
      });
    }
  }

  get formControls() { return this.passwordRecoverForm.controls; }

  telaLogin(){
    this.router.navigateByUrl('/login');
  }

  async passwordRecover() {
    console.log(this.passwordRecoverForm.value);

    this.mensagemRetorno = "";
    this.isSubmitted = true;
    if (this.passwordRecoverForm.invalid) {
      return;
    }

    if (!this.isValidating) {

      await this.authService.passwordRecover(this.passwordRecoverForm.value)
        .then(retorno => {
          console.log('sucesso', retorno)
          this.isValidating = true;
          this.habiblitaVerificacaoCodigo();
        }).catch(err => {
          console.log('err', err.message)
          this.mensagemRetorno = err.message
        });
    } else {
      await this.authService.confirmRecoverPassword(this.passwordRecoverForm.value)
      .then(retorno => {
        console.log('sucesso', retorno)
        this.mensagemRetorno = "Senha alterada com sucesso."
        this.passwordRecoverForm.reset()
      }).catch(err => {
        console.log('err', err.message)
        this.mensagemRetorno = err.message
      });
    }

    this.isSubmitted = false;

  }
}
