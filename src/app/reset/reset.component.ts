import { CustomValidators } from './../custom-validators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from './../login.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
})
export class ResetComponent implements OnInit {
  public resetFormGroup: FormGroup;
  public submitted = false;

  public constructor(
    private _router: Router,
    private formBuilder: FormBuilder,
    private _loginService: LoginService,
  ) {}

  ngOnInit() {
    this.resetFormGroup = this.formBuilder.group(
      {
        password: [
          '',
          [Validators.required, CustomValidators.passwordValidator, Validators.minLength(8)],
        ],
        repPassword: ['', Validators.required],
      },
      {
        validator: CustomValidators.passwordMatchValidator,
      },
    );
  }

  public required(fieldName: string) {
    return this._loginService.required(fieldName, this.resetFormGroup);
  }
  public invalid(fieldName: string) {
    return this._loginService.invalid(fieldName, this.resetFormGroup);
  }
  public comparePasswords(fieldName: string): boolean {
    return this.submitted && this.resetFormGroup.get(fieldName).hasError('NoPasswordMatch');
  }

  public wrongMinLength(fieldName: string) {
    return this._loginService.wrongMinLength(fieldName, this.resetFormGroup);
  }

  public resetPassword() {
    this.submitted = true;

    if (this.resetFormGroup.invalid) {
      return;
    }

    if (this.resetFormGroup.valid) {
      this._router.navigate(['/login']);
    }
  }
}
