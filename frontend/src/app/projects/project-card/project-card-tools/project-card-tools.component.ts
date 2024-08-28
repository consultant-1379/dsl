import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Project } from '../../../_models/project';
import { VotingService } from '../../../_services/data/voting.service';
import { CommentsComponent } from '../../../shared/dialogs/comments/comments.component';
import { DependsOn, DEFAULT_TOASTR_MESSAGE } from 'src/app/_services/liveness/depends-on.decorator';
import { COUCHDB } from 'src/app/_services/liveness/dependencies';
import { DslToastrService } from 'src/app/_services/dsl-toastr.service';

@Component({
  selector: 'app-project-card-tools',
  templateUrl: './project-card-tools.component.html',
  styleUrls: ['./project-card-tools.component.scss'],
})
export class ProjectCardToolsComponent implements OnInit {

  @Input() project?: Project;

  constructor(
    private votingService: VotingService,
    public dialog: MatDialog,
    private dslToastrService: DslToastrService,
  ) { }

  ngOnInit() {
  }

  @DependsOn([COUCHDB], DEFAULT_TOASTR_MESSAGE)
  onComment() {
    const dialogRef = this.dialog.open(CommentsComponent, {
      width: '90%',
      maxWidth: '600px',
      panelClass: 'team-modal-panel',
      id: 'team-modal',
      data: this.project,
    });
  }

  @DependsOn([COUCHDB], DEFAULT_TOASTR_MESSAGE)
  onVote(project: Project) {
    this.votingService.voteForProject(project)
      .catch((error) => {
        console.error(`Voting failed: ${error}`);
        this.dslToastrService.error('There was a problem submitting your vote, please try again later.', 'Vote Failed');
      });
  }

}
