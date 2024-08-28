import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-hashtag-chip-list',
  templateUrl: './hashtag-chip-list.component.html',
  styleUrls: ['./hashtag-chip-list.component.scss'],
})
export class HashtagChipListComponent implements OnInit {

  hashtags: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  constructor() { }

  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    let value = event.value;

    value = this.removeHashCharacter(value);
    if ((value || '').trim()) {
      this.hashtags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  private removeHashCharacter(value: string): string {
    return value.replace('#', '');
  }

  remove(hashtag: string) {
    const index = this.hashtags.indexOf(hashtag);

    if (index >= 0) {
      this.hashtags.splice(index, 1);
    }
  }

  public getHashtags(): string[] {
    return this.hashtags;
  }

}
