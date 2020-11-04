import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  newUserForm: FormGroup;
  savedForm: FormGroup;
  isSubmitted = false;
  mensagemRetorno = "";
  isValidating = false;
  titulo = "Novo Usuário";

  ngOnInit() {
    this.newUserForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern('')])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
        Validators.pattern('')])],
      repassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
        Validators.pattern('')])]
    });
  }

  habiblitaVerificacaoCodigo() {
    if (this.isValidating) {
      this.newUserForm = this.formBuilder.group({
        codigo: ['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          Validators.pattern('^[0-9]*$')])],
        email: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern('')])],
        password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
          Validators.pattern('')])],
        repassword: ['', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
          Validators.pattern('')])]
      });
    }
  }

  get formControls() {
    return this.newUserForm.controls;
  }

  get validationForm() {
    return this.newUserForm.status === 'INVALID';
  }

  telaLogin() {
    this.router.navigateByUrl('/login');
  }

  async newUser() {

    this.mensagemRetorno = "";
    this.isSubmitted = true;

    this.savedForm = this.newUserForm;

    if (this.newUserForm.invalid) {
      return;
    }

    if (!this.isValidating) {
      await this.authService.signUp(this.newUserForm.value)
        .then(retorno => {
          if (retorno) {
            this.mensagemRetorno = String(JSON.stringify(retorno));
          } else {
            this.mensagemRetorno = "Usuário cadastrado com sucesso";
            this.isValidating = true
            this.habiblitaVerificacaoCodigo();
            this.isSubmitted = false;
            this.mensagemRetorno = "";
            this.titulo = "Validação de Registro"
            this.newUserForm.reset(this.savedForm.value)
          }
        })
        .catch(err => {
          console.log('err', err.message)
          this.mensagemRetorno = err.message
        });
    } else {
      await this.authService.verifyCode(this.newUserForm.value)
        .then(retorno => {
          if (!retorno) {
            this.isValidating = false;
            this.isSubmitted = false;
            this.newUserForm.reset();
            alert("Usuário validado com sucesso!");
            this.router.navigate(['/login']);
          } else {
            this.mensagemRetorno = String(retorno)
          }
        }).catch(err => {
          console.log('err', err.message)
          this.mensagemRetorno = err.message
        });
    }
  }
}
