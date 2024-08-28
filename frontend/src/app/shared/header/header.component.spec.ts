import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../_services/authentication-service/authentication.service';
import { HeaderComponent } from './header.component';
import { LocalStorageService } from '../../_services/local-storage.service';
import { User } from '../../_models/user';
import { DialogService } from 'src/app/_guards/dialog.service';
import { DslToastrService } from 'src/app/_services/dsl-toastr.service';

describe('HeaderComponent', () => {
  let headerComponent: HeaderComponent;

  const testUser = new User();
  testUser._id = 'etesuse';
  testUser.displayName = 'Test User';
  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getUser']);
  localStorageServiceMock.getUser.and.returnValue(testUser);

  const authenticationServiceMock = {
    loggedIn: {
      subscribe: () => {},
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeaderComponent,
        { provide: MatDialog, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: DialogService, useValue: {} },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: DslToastrService, useValue: {} },
      ],
    });

    headerComponent = TestBed.get(HeaderComponent);
  });

  describe('showLoggedIn', () => {

    it('should set the userLogged variable', () => {

      headerComponent.userlogged = false;

      headerComponent.showLoggedIn(true);

      expect(headerComponent.userlogged).toBe(true);

    });

    it('should set the user initials if user is logged in', () => {

      headerComponent.showLoggedIn(true);

      expect(headerComponent.userInitials).toBe('TU');

    });

    it('should not set the user initials if user is not logged in', () => {

      headerComponent.showLoggedIn(false);

      expect(headerComponent.userInitials).toBe('');

    });

  });
});
