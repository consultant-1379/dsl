import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../_services/data/project.service';
import { Project } from '../_models/project';
import { DependsOn } from '../_services/liveness/depends-on.decorator';
import { COUCHDB } from '../_services/liveness/dependencies';
import { LivenessErrorHandlingService } from '../_services/liveness/liveness-error-handling.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private bodyText: string;
  featuredProjects: Project[];
  latestProjects: Project[];

  constructor(
    public projectService: ProjectService,
    private livenessErrorHandlingService: LivenessErrorHandlingService) { }

  ngOnInit() {
    this.bodyText = 'This text can be updated in modal 1';
    this.getFeaturedProjects();
    this.getLatestProjects();
  }

  @DependsOn([COUCHDB])
  getFeaturedProjects() {
    this.projectService
      .getFeaturedProjects()
      .then((data) => {
        this.featuredProjects = data;
        console.log(this.featuredProjects);
      })
      .catch((err) => {
        this.livenessErrorHandlingService.checkForLivenessError();
        console.error(err);
      });
  }

  @DependsOn([COUCHDB])
  getLatestProjects(): any {
    this.projectService
      .getLatestProjects()
      .then((data) => {
        this.latestProjects = data;
        console.log(data);
      })
      .catch((err) => {
        this.livenessErrorHandlingService.checkForLivenessError();
        console.error(err);
      });
  }

  // FIXME: Empty method
  closeModal(id: string) {
  }
}
