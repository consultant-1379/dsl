import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DialogService } from './dialog.service';
import { ProjectsComponent } from '../projects/projects.component';
import { LocalStorageService } from '../_services/local-storage.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ProjectsComponent> {
  constructor(private dialogService: DialogService, private localStorageService: LocalStorageService) {
  }

  canDeactivate(projectsComponent: ProjectsComponent) {
    if (this.localStorageService.getUser()) {
      try {
        if (projectsComponent.CreateComponent.formHasBeenAltered()) {
          return this.dialogService.confirm('Are you sure you want to leave the creation page?\nYour changes will not be saved.');
        }
        return true;
      } catch {
        return true;
      }
    }
    return true;
  }
}
