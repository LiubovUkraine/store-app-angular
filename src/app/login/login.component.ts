import { LoginService } from './../login.service';
import { CustomValidators } from './../custom-validators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public formGroup: FormGroup;
  public submitted = false;
  public passwordMassage = false;

  constructor(
    private formBuilder: FormBuilder,
    private _loginService: LoginService,
    private _router: Router,
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, CustomValidators.passwordValidator, Validators.minLength(8)],
      ],
    });
  }

  public required(fieldName: string) {
    return this._loginService.required(fieldName, this.formGroup);
  }

  public invalid(fieldName: string) {
    return this.submitted && this._loginService.invalid(fieldName, this.formGroup);
  }

  public wrongMinLength(fieldName: string) {
    return this._loginService.wrongMinLength(fieldName, this.formGroup);
  }

  public isEmailInvalid(): boolean {
    return this.submitted && this.formGroup.get('email').hasError('email');
  }

  public submitLoginForm() {
    this.submitted = true;

    if (this.formGroup.invalid) {
      console.log('invalid form group');
      return;
    }

    if (this.formGroup.valid) {
      this._loginService.signupToFB(
        this.formGroup.controls['email'].value,
        this.formGroup.controls['password'].value,
      );

      this._loginService.addUserInDb(this.formGroup);

      this._router.navigate(['/store'], {
        queryParams: { id: this._loginService.user.id },
      });
    }
  }
}
