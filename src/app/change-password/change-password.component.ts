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

  checkPasswordStrength(validator: string): boolean {
    const list = {
      lower: /([a-z])/g,
      upper: /([A-Z])/g,
      number: /([0-9])/g,
      special: /[^A-z\s\d][\\\^]?/g,
      eight: /^.{8,}$/g
    };
    const { password } = this.passwordForm.getRawValue();
    const regex = RegExp(list[validator]);
    return regex.test(password);
  }

  strengthScore(): number {
    let score = 0;
    if (this.checkPasswordStrength('lower')) {
      score += 20;
    }
    if (this.checkPasswordStrength('upper')) {
      score += 20;
    }
    if (this.checkPasswordStrength('number')) {
      score += 20;
    }
    if (this.checkPasswordStrength('special')) {
      score += 20;
    }
    if (this.checkPasswordStrength('eight')) {
      score += 20;
    }

    return score;
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
