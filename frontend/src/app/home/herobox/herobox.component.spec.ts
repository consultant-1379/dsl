import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroboxComponent } from './herobox.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HeroboxComponent', () => {
  let component: HeroboxComponent;
  let fixture: ComponentFixture<HeroboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeroboxComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
