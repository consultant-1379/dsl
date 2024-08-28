import { Component, OnInit, Input, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ProjectsComponent } from '../projects.component';
import { ConfirmDeleteComponent } from '../../projects/delete.dialog.component';
import { LivenessService } from 'src/app/_services/liveness/liveness.service';
import { DependsOn, DEFAULT_TOASTR_MESSAGE } from '../../_services/liveness/depends-on.decorator';
import { COUCHDB, BACKEND, GITLAB } from '../../_services/liveness/dependencies';

@Component({
  selector: 'ws-toolbar',
  templateUrl: './ws-toolbar.component.html',
  styleUrls: ['./ws-toolbar.component.scss'],
})
export class WsToolbarComponent implements OnInit {
  subscription: any;
  message: string;
  isNotebooks = false;
  @ViewChild('delNotebook') delNb: ElementRef;
  isToolbar = true;

  constructor(
    private projectComponent: ProjectsComponent,
    private dialog: MatDialog,
    private livenessService: LivenessService) {}

  ngOnInit() {
  }

  @DependsOn([COUCHDB, GITLAB, BACKEND], DEFAULT_TOASTR_MESSAGE)
  createProject() {
    this.projectComponent.createProject();
  }

  @DependsOn([COUCHDB, GITLAB], DEFAULT_TOASTR_MESSAGE)
  deleteProject() {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '90%',
      maxWidth: '400px',
      panelClass: 'team-modal-panel',
      id: 'team-modal',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.projectComponent.deleteProject();
      } else {
        console.log('You decided not to delete the project!');
      }
      console.log(result);
    });
  }

}
