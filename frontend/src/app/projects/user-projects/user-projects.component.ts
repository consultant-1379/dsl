import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { GitService } from '../../_services/git.service';
import { ProjectCommService } from '../services/project-comm.service';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.scss'],
})
export class UserProjectsComponent implements AfterViewInit, OnInit {
  selectedproject: any;
  repositories: any = [];
  repofiles: any = [];
  message: string;
  subscription: any;
  displayedColumns: string[] = ['name'];
  repoDatasets: any = [];
  repoNotebooks: any = [];
  isLoading: boolean;

  constructor(private gitService: GitService, private projectCommService: ProjectCommService) {
    this.subscription = this.projectCommService.titleData$.subscribe((res) => {

      if (res) {
        this.selectedproject = res;
        this.getRepository();
      }
    });
  }

  ngOnInit() {
  // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  // Add 'implements OnInit' to the class.
  // this.subscription = this.projectService.titleData$.subscribe(res => {
  //   this.selectedproject = res;
  //   this.getRepository();
  // });
  }
  ngAfterViewInit() {
   // this.event.currentMessage.subscribe(message => this.message = message)

    // if (this.selectedproject.id) {
    //   console.log(this.message);
    //   this.getRepository();
    // }
  }
  getRepository() {
    this.repoDatasets = [];
    this.repoNotebooks = [];
    this.isLoading = true;
    this.gitService.getRepository(this.selectedproject.id).subscribe(
      (data) => {
        if (data.toString().length !== 0) {
          this.repositories = data;
          console.log(data);
          this.isLoading = false;
        } else {
          this.repositories = [];
        }
      },
      () => { // error
        this.isLoading = false;
        this.repositories = [];
      },
      () => {
        if (this.repositories.length > 0) {
          const _datasets = this.repositories.filter(x => x.name === 'datasets');
          if (_datasets.length > 0) {
            this.getRepositoryFiles('datasets');
          }
          const _notebooks = this.repositories.filter(x => x.name === 'notebooks');
          if (_notebooks.length > 0) {
            this.getRepositoryFiles('notebooks');
          }
        } else {
          this.isLoading = false;
        }
      });
  }
  getRepositoryFiles(repo: string) {
    this.gitService.getRepositoryFiles(this.selectedproject.id, repo).subscribe(
      (data) => {
        console.log(data);

        if (repo === 'datasets') {
          this.repoDatasets = data;
        } else {
          this.repoNotebooks = data;
        }
      },
      () => { // error
        this.isLoading = false;
      },
      () => this.isLoading = false);
  }
  expandRepository(filepath) {
    this.gitService.getRepositoryFiles(this.selectedproject.id, filepath).subscribe(
      (data) => {
        console.log(data);
        this.repofiles = data;
      },
      () => { // error
        // this.loading = false;
      });
  }
}
