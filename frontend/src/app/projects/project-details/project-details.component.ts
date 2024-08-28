import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../_models/project';
import { ConfigService } from 'src/app/_services/config.service';
import { ProjectService } from 'src/app/_services/data/project.service';
import { DependsOn, DEFAULT_TOASTR_MESSAGE } from '../../_services/liveness/depends-on.decorator';
import { GITLAB } from '../../_services/liveness/dependencies';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {

  project: Project = new Project();
  id: string;
  baseGitlabURL: string;
  viewProjectLink = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private configService: ConfigService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.getProject();
    this.baseGitlabURL = this.configService.get('GITLAB_SERVER');
  }

  getProject() {
    this.projectService
      .getProjectById(this.id)
      .then((data) => {
        this.project = data;
        this.viewProjectLink = this.baseGitlabURL + this.project.linkToFile;
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // this method allows us to check if Gitlab is up before navigating there
  onViewProjectClick(event) {
    event.preventDefault();
    this.followLink();
  }

  @DependsOn([GITLAB], DEFAULT_TOASTR_MESSAGE)
  followLink() {
    window.open(this.viewProjectLink);
  }
}
