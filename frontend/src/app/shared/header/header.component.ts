// declare var require: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication-service/authentication.service';
import { LoginComponent } from '../../login/login.component';
import { MatDialog } from '@angular/material';
import { LocalStorageService } from '../../_services/local-storage.service';
import { DialogService } from '../../_guards/dialog.service';
import { User } from '../../_models/user';
import { DslToastrService } from '../../_services/dsl-toastr.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userlogged = false;
  userInitials = '';

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private localStorageService: LocalStorageService,
    private dslToastrService: DslToastrService,
  ) {
    authenticationService.loggedIn.subscribe(isLogged => this.showLoggedIn(isLogged));
  }

  ngOnInit() {
    const _user = this.localStorageService.getUser();
    if (_user) {
      this.userlogged = true;
      this.createInitials(_user);
    }
  }
  private createInitials(_user: User) {
    console.log(_user);
    console.log(_user.displayName);
    this.userInitials = _user.displayName
      .split(' ')
      .map(n => n[0])
      .join('');
  }
  onLogin(id: string) {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '450px',
      panelClass: 'panel-transparent',
    });
  }
  showLoggedIn(isLogged: boolean) {
    this.userlogged = isLogged;
    if (this.userlogged) {
      const _user = this.localStorageService.getUser();
      this.createInitials(_user);
    }
  }

  onLogout() {
    let response;
    this.dialogService.confirm('Are you sure you want to log out?').subscribe((confirmation) => {
      response = confirmation;
      if (response === false) {
        console.log('User did not log out of the system.');
      } else {
        this.router.navigate(['/']);
        this.authenticationService.logout();
        this.dslToastrService.info('You have logged out of the system.', 'Logout Successful');
        this.userlogged = false;
      }
    });
  }
}
