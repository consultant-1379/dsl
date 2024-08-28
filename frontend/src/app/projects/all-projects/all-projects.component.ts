import { Component, OnInit } from '@angular/core';
import { Project } from '../../_models/project';
import { ProjectService } from 'src/app/_services/data/project.service';
import { DependsOn } from 'src/app/_services/liveness/depends-on.decorator';
import { COUCHDB } from 'src/app/_services/liveness/dependencies';
import { LivenessErrorHandlingService } from 'src/app/_services/liveness/liveness-error-handling.service';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss'],
})
export class AllProjectsComponent implements OnInit {

  projects: Project[];

  constructor(
    private projectService: ProjectService,
    private livenessErrorHandlingService: LivenessErrorHandlingService) { }

  ngOnInit() {
    this.getProjects();
  }

  @DependsOn([COUCHDB])
  getProjects(): any {
    this.projectService
      .getProjects()
      .then((data) => {
        this.projects = data;
        console.log(data);
      })
      .catch((err) => {
        this.livenessErrorHandlingService.checkForLivenessError();
        console.error(err);
      });
  }
}
