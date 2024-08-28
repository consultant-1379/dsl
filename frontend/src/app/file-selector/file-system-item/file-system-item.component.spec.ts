import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSystemItemComponent } from './file-system-item.component';

describe('FileSystemItemComponent', () => {
  let component: FileSystemItemComponent;
  let fixture: ComponentFixture<FileSystemItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileSystemItemComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSystemItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
