import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCardToolsComponent } from './project-card-tools.component';

describe('ProjectCardToolsComponent', () => {
  let component: ProjectCardToolsComponent;
  let fixture: ComponentFixture<ProjectCardToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectCardToolsComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCardToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
