import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtagChipListComponent } from './hashtag-chip-list.component';

describe('HashtagChipListComponent', () => {
  let component: HashtagChipListComponent;
  let fixture: ComponentFixture<HashtagChipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HashtagChipListComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
