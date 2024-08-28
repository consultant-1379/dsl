import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectsComponent } from './user-projects.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GitService } from '../../_services/git.service';
import { ConfigService } from '../../_services/config.service';

describe('UserProjectsComponent', () => {
  let component: UserProjectsComponent;
  let fixture: ComponentFixture<UserProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserProjectsComponent],
      providers: [GitService, ConfigService],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
