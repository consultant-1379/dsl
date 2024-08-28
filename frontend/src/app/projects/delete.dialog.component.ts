import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProjectsComponent } from '../projects/projects.component';

@Component({
  selector: 'app-delete-project',
  templateUrl: 'delete.dialog.component.html',
  styleUrls: ['delete.dialog.component.scss'],
})
export class ConfirmDeleteComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmDeleteComponent>, private project: ProjectsComponent) {}

  confirmDelete() {
    const toDelete = true;
    this.project.deleteProject();
    this.dialogRef.close(toDelete);
  }

  onNoClick(): void {
    const toDelete = false;
    this.dialogRef.close(toDelete);
  }

}
