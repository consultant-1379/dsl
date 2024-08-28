import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { LocalStorageService } from '../local-storage.service';
import { LoginResult } from './loginResult/loginResult';
import { LoginError } from './loginResult/loginError';
import { DslToastrService } from '../dsl-toastr.service';

@Injectable()
export class AuthenticationService {
  @Output() loggedIn: EventEmitter<any> = new EventEmitter();

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private dslToastrService: DslToastrService,
    private localStorageService: LocalStorageService,
    ) {}

  login(username: string, password: string) {
    return this.http
      .post<LoginResult>(`${this.configService.getDSLBackendDetails('URL')}/auth/login`, {
        username,
        password,
      })
      .map((loginResult) => {
        this.logUserIn(loginResult);
        return loginResult.user;
      })
      .catch((error) => {
        const loginError: LoginError = error.error;
        this.loginFail(loginError);
        throw error;
      });
  }

  private logUserIn(loginResult: LoginResult) {
    this.localStorageService.setUser(loginResult.user);
    this.localStorageService.setJwtToken(loginResult.token);
    this.loggedIn.emit(true);
  }

  logout() {
    // remove user from local storage to log user out
    this.localStorageService.removeUser();
    this.localStorageService.removeJwtToken();
    this.loggedIn.emit(false);
  }

  private loginFail(loginError: LoginError) {
    let toastrMessage: string;
    if (loginError.userFriendlyError) {
      toastrMessage = loginError.userFriendlyError;
    } else {
      toastrMessage = 'Failed to log into the system. Please try again.';
    }
    this.dslToastrService.error(toastrMessage, 'Login failed', DslToastrService.LONG);
    this.loggedIn.emit(false);
  }
}
