import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../_models/project';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {

  @Input() project: Project;
  truncatedHashtags: string;
  allHashtags: string;

  constructor() { }

  ngOnInit() {
    this.createTruncatedStringOfHashtags();
    this.createStringOfAllHashtags();
  }

  private createTruncatedStringOfHashtags() {
    this.truncatedHashtags = '';

    for (const hashtag of this.project.hashtags) {
      if (this.truncatedHashtags.length + hashtag.length < 25) {
        this.truncatedHashtags += `#${hashtag} `;
      } else {
        this.truncatedHashtags = this.truncatedHashtags.trim(); // Remove the space at the end of the last hashtag we added
        this.truncatedHashtags += '...';
        return;
      }
    }
  }

  private createStringOfAllHashtags() {
    this.allHashtags = '';

    for (const hashtag of this.project.hashtags) {
      this.allHashtags += `#${hashtag} `;
    }

    this.allHashtags = this.allHashtags.trim(); // Remove the space at the end of the last hashtag we added
  }

}
