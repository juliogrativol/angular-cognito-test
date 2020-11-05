import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  message = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private validator: ValidatorService
  ) { }


  passwordForm = this.fb.group({
    oldPassword: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
      Validators.pattern('')
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
      Validators.pattern('')
    ]],
    confirmPass: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
      Validators.pattern('')
    ]]
  }, { validators: [this.validator.checkPasswords] });

  ngOnInit() {
  }

  get validate() {
    return this.passwordForm.status === 'INVALID';
  }

  changePassword(): void {
    const pass = this.passwordForm.getRawValue();
    const { idToken } = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
    this.authService.changePassword(pass.oldPassword, pass.password, idToken.payload.email).then(
      result => {
        this.message = "Troca realizada com sucesso";
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      }
    ).catch(error => {
      this.message = error.message;
      this.passwordForm.patchValue({
        oldPassword: ''
      });
    });
  }

}
