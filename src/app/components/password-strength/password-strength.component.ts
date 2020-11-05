import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.css']
})
export class PasswordStrengthComponent implements OnInit {

  @Input() form: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  checkPasswordStrength(validator: string): boolean {
    const list = {
      lower: /([a-z])/g,
      upper: /([A-Z])/g,
      number: /([0-9])/g,
      special: /[^A-z\s\d][\\\^]?/g,
      eight: /^.{8,}$/g
    };
    const { password } = this.form.getRawValue();
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

}
