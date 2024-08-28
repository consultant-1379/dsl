import { ProjectCommService } from './services/project-comm.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GitService } from '../_services/git.service';
import { MatTabChangeEvent } from '@angular/material';
import { UserProjectsComponent } from './user-projects/user-projects.component';
import { LocalStorageService } from '../_services/local-storage.service';
import { ProjectService } from '../_services/data/project.service';
import { CreateComponent } from './create/create.component';
import { DependsOn } from '../_services/liveness/depends-on.decorator';
import { LivenessErrorHandlingService } from '../_services/liveness/liveness-error-handling.service';
import { GITLAB } from '../_services/liveness/dependencies';
import { BackendService } from '../_services/backend/backend.service';
import { DslToastrService } from '../_services/dsl-toastr.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})

export class ProjectsComponent implements OnInit {
  subscription: any;
  isLoading = false;
  isCreate = false;
  username: string;
  userid: string;
  isUser = true;
  isProjects = true;
  isNewDataset = false;
  isNewNotebook = false;
  projects: any;
  repositories: any = [];
  repofiles: any = [];
  selectedProject: any = [];
  isSelectedProject: number;
  selectedTab: number;
  data: any[];
  uniqueId: string; // unique name given to the temporary folder containing the uploaded files on the backend

  constructor(
    private gitService: GitService,
    private projectCommService: ProjectCommService,
    private projectService: ProjectService,
    private backendService: BackendService,
    private localStorageService: LocalStorageService,
    private dslToastrService: DslToastrService,
    private livenessErrorHandlingService: LivenessErrorHandlingService,
    ) {  }

  @ViewChild(UserProjectsComponent) UserProjectsComponent: UserProjectsComponent;
  @ViewChild(CreateComponent) CreateComponent: CreateComponent;

  ngOnInit() {
    const user = this.localStorageService.getUser();
    this.username = user._id;
    console.log(this.username);
    this.isLoading = true;
    this.getUser();
  }

  createProject() {
    if (this.isCreate) {
      console.log('project.component.createProject(): Project upload directory already created.');
      return;
    }
    this.uniqueId = `${this.username}-${String(new Date().getTime())}`;
    this.backendService.createUploadDirectory(this.username, this.uniqueId)
      .subscribe(() => { // data
        console.log(this.uniqueId);
      });
    this.isCreate = true;
  }

  deleteProject(): any {
    if (!this.aProjectHasBeenSelected()) {
      return;
    }
    this.gitService.deleteProject(this.username, this.selectedProject.name).subscribe(
    () => {
      this.onProjectDeletedFromGitlab(
      this.selectedProject.id,
      3,
      () => {
        this.deleteProjectFromDatabase(this.selectedProject)
        .then(
          () => {
            this.dslToastrService.info('You successfully deleted the project.', 'Project Deleted');
            this.getUserProjects();
          });
      });
    },
    (error) => {
      console.log(`Error when deleting project from gitlab: ${error}`);
      this.livenessErrorHandlingService.checkForLivenessError();
    });
  }

  onProjectDeletedFromGitlab(projectId: number, retries: number, action: Function) {
    if (retries === 0) {
      console.log('Error, has not been deleted');
      return;
    }
    this.gitService.getProjectById(projectId).subscribe(
      () => {
        // projects still exist, try again
        setTimeout(() => {
          this.onProjectDeletedFromGitlab(projectId, retries - 1, action);
        },         50);
      },
      () => {
        // the project was not found, it has been deleted sucessfully
        action();
      },
    );
  }

  aProjectHasBeenSelected() {
    return this.selectedProject && this.selectedProject.name;
  }

  deleteProjectFromDatabase(project: any) {
    return this.projectService.getProjectByProjectNameAndAuthor(project.name, this.username)
      .then((resultProject) => {
        return this.projectService.deleteProject(resultProject._id);
      });
  }

  @DependsOn([GITLAB])
  getUser() {
    this.gitService.getUserBySignum(this.username).subscribe(
      (data) => {
        if (data.toString().length !== 0) {
          this.userid = data[0].id;
          this.isLoading = false;
          this.getUserProjects();
        } else {
          this.isProjects = false;
        }
      },
      (error) => {
        console.log(error);
        this.livenessErrorHandlingService.checkForLivenessError();
        this.isLoading = false;
      },
    );
  }

  displayNotebooks() {
    this.isNewNotebook = false;
  }

  @DependsOn([GITLAB])
  getUserProjects() {
    this.isCreate = false;

    this.gitService.getProjectsByUser(this.userid).subscribe(
      (data) => {
        if (data.toString().length !== 0) {
          this.projects = data;
          console.log(this.projects);
        } else {
          this.projects = [];
        }
      },
      () => { // error
        this.livenessErrorHandlingService.checkForLivenessError();
        this.isLoading = false;
      },
      () => {
        this.isProjects = true;
        this.isNewNotebook = false;
        if (this.projects.length > 0) {
          this.displayProjectDetails(this.projects[0].id, 0);
        }
        this.isLoading = false;
      },
    );
  }

  displayProjectDetails(_projectid, _id?) {
    // this.isLoading = true;
    this.selectedProject = this.projects.filter(
      elem => elem.id === _projectid,
    )[0];
    this.isSelectedProject = _id;
    this.isNewNotebook = false;
    this.selectedTab = 0;
    this.projectCommService.update(this.selectedProject);
    if (this.UserProjectsComponent) {
      this.UserProjectsComponent.getRepository();
    }
  }

  setIsCreate(componentInput) {
    this.isCreate = componentInput;
  }
}
