import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { GitService } from '../../_services/git.service';
import { ProjectCreationService } from '../../_services/workspace-services/project-creation/project-creation.service';
import { ConfigService } from '../../_services/config.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Project } from '../../_models/project';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HashtagChipListComponent } from '../../shared/hashtag-chip-list/hashtag-chip-list.component';
import { FileSelectorComponent } from '../../file-selector/file-selector.component';
import { FileSystemItemAdapter } from '../../file-selector/file-system-item-adapter/fileSystemItemAdapter';
import { User } from '../../_models/user';
import { LocalStorageService } from '../../_services/local-storage.service';
import { DialogService } from '../../_guards/dialog.service';
import { MatSpinner } from '@angular/material';
import { LivenessErrorHandlingService } from '../../_services/liveness/liveness-error-handling.service';
import { DependsOn, DEFAULT_TOASTR_MESSAGE } from '../../_services/liveness/depends-on.decorator';
import { GITLAB, BACKEND, COUCHDB } from '../../_services/liveness/dependencies';
import { BackendService } from 'src/app/_services/backend/backend.service';
import { DslToastrService } from 'src/app/_services/dsl-toastr.service';

@Component({
  selector: 'project-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  isLoading = false;
  user: User;
  userGitlabId: string;
  filesHaveBeenUploaded = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() uniqueId: string; // unique name given to the temporary folder containing the uploaded files on the backend
  @ViewChild(HashtagChipListComponent) hashtagComponent: HashtagChipListComponent;
  @ViewChild(FileSelectorComponent) fileSelectorComponent: FileSelectorComponent;

  formProject = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    category: new FormControl(),
  });

  @Output() add: EventEmitter<any> = new EventEmitter<any>();
  @Output() isCreate: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public configService: ConfigService,
    private projectCreationService: ProjectCreationService,
    private gitService: GitService,
    private localStorageService: LocalStorageService,
    private backendService: BackendService,
    private dslToastrService: DslToastrService,
    public dialogService: DialogService,
    private livenessErrorHandlingService: LivenessErrorHandlingService) {
  }

  ngOnInit() {
    this.user = this.localStorageService.getUser();
    this.gitService.getUserBySignum(this.user._id).subscribe(
      (data) => {
        this.userGitlabId = data[0].id;
      },
      (error) => {
        console.log(error);
      },
    );
  }

  @DependsOn([COUCHDB, GITLAB, BACKEND], DEFAULT_TOASTR_MESSAGE)
  createProject() {

    if (!this.userInputIsValid()) {
      return;
    }
    this.isLoading = true;
    const project = this.getProjectFromUserInput();

    // this.loading = true;
    this.projectCreationService.createProject(this.userGitlabId, project, this.uniqueId).then(() => {
      console.log('Overall success');
      this.isCreate.emit(false);
      this.add.next();
      this.dslToastrService.success('The project was published successfully.', 'Publishing Complete');
    }).catch((error) => {
      console.log(`Error while creating project: ${error}`);
      this.add.next();
      this.dslToastrService.error('There was a problem publishing the project, please try again.', 'Publishing Failed');
      this.livenessErrorHandlingService.checkForLivenessError();
    });
  }

  getProjectFromUserInput(): Project {
    const project = new Project();
    const form = this.formProject;
    const linkName = form.controls['name'].value.replace(/\s+/g, '-');

    project.projectname = this.valueOrEmptyString(form.controls['name'].value);
    project.description = this.valueOrEmptyString(form.controls['description'].value);
    project.author = this.valueOrEmptyString(this.user._id);
    project.authorDisplayName = this.valueOrEmptyString(this.user.displayName);
    project.category = this.valueOrEmptyString(form.controls['category'].value);
    project.hashtags = this.hashtagComponent.getHashtags();
    project.public = true;
    project.featured = true;
    project.linkToFile = `/${this.user._id}/${linkName}/blob/master${this.fileSelectorComponent.getPathToFile()}`;

    return project;
  }

  userInputIsValid() {

    if (this.formProject.controls['name'].hasError('required')) {
      this.dslToastrService.error('You must enter a project name.', 'Publishing Failed');
      return false;
    }
    if (this.formProject.controls['name'].hasError('pattern')) {
      this.dslToastrService.error(
        `The project name that you entered is invalid.
          Project names must start with a letter or a number
           and cannot contain any special characters (&, @, * etc.)`,
        'Publishing Failed',
        DslToastrService.LONG);
      return false;
    }
    if (!this.filesHaveBeenUploaded) {
      this.dslToastrService.error('You must upload files for your project.', 'Publishing Failed');
      return false;
    }
    return true;
  }

  cancel() {
    console.log(this.user._id);

    this.backendService.cancelProject(this.user._id)
    .subscribe((data) => {
      console.log(data);
      this.isCreate.emit(false);
      this.dslToastrService.info('You cancelled the project creation process.', 'Project Cancelled');
    });
  }

  valueOrEmptyString(value: string) {
    // return an empty string if the value is 'falsey' (null, undefined etc.)
    if (value) {
      return value;
    }

    return '';
  }

  onFileUploaded(files: string[]) {
    this.filesHaveBeenUploaded = true;
    const fileSystemItemAdapter = new FileSystemItemAdapter(files);
    this.fileSelectorComponent.setFileSystemItemAdapter(fileSystemItemAdapter);
  }

  onFileUploadUndone() {
    this.filesHaveBeenUploaded = false;
  }

  changeFocus(event, elementToFocusOn) {
    if (event.keyCode === 13) {
      const element = (<HTMLInputElement> document.getElementById(elementToFocusOn));
      if (element) {
        element.focus();
      } else {
        console.error('The element to focus on does not exist!');
      }
    }
  }

  formHasBeenAltered() {
    if (this.formProject.dirty || this.filesHaveBeenUploaded || this.hashtagComponent.getHashtags().length > 0) {
      return true;
    }
    return false;
  }
}
