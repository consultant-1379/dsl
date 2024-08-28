import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthenticationService } from '../_services/authentication-service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  firstFormGroup: FormGroup;
  isLoading: boolean;

  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      user_name: [''],
      user_password: [''],
    });
  }
  onSubmit() {
    console.log(this.firstFormGroup.get('user_name').value);
    this.isLoading = true;
    this.authenticationService
      .login(
        this.firstFormGroup.get('user_name').value,
        this.firstFormGroup.get('user_password').value,
      )
      .subscribe(
        () => { // data
          this.dialogRef.close();
        },
        () => { // error
          this.isLoading = false;
        },
      );

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  enterToLogin(event: any) {
    if (event.keyCode === 13) {
      this.onSubmit();
    }
  }
}
