import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// let userServiceStub: Partial<UserService>;
let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;

describe('AppComponent', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
  });

});
