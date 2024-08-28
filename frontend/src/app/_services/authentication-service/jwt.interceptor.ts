import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { LocalStorageService } from '../local-storage.service';
import { DslToastrService } from '../dsl-toastr.service';

/**
 * JwtInterceptor - if a JwtToken is in LocalStorage add it to any http request from the frontend.
 *
 * This code heavily borrowed from: https://www.illucit.com/angular/en-angular-5-httpinterceptor-add-bearer-token-to-httpclient-requests/
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private localStorage: LocalStorageService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private dslToastrService: DslToastrService,
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return Observable.fromPromise(this.handleAccess(request, next))
      .catch((error) => {
        if (error.status === 401) {
          this.handle401Error();
        }
        return next.handle(request);
      });
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    // FIXME: Ugly hack.
    if (request.url.includes(':19080')) {
      return next.handle(request).toPromise();
    }

    const jwtToken = await this.localStorage.getJwtToken();
    const headerSettings: {[name: string]: string | string[]; } = {};

    for (const key of request.headers.keys()) {
      headerSettings[key] = request.headers.getAll(key);
    }

    if (jwtToken) {
      headerSettings['Authorization'] = `Bearer ${jwtToken}`;
    }
    headerSettings['Content-Type'] = 'application/json';
    const newHeader = new HttpHeaders(headerSettings);

    const changedRequest = request.clone({ headers: newHeader });
    return next.handle(changedRequest).toPromise();
  }

  private handle401Error() {
    // first check if the user is logged in
    if (this.localStorage.getUser()) {
      this.authenticationService.logout();
      this.router.navigate(['/']);
      this.dslToastrService.warning('Your session has timed out. Please log in again.', 'Session Timeout');
    }
  }
}
