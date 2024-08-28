import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../../_services/authentication-service/authentication.service';
import { ProjectService } from '../../../_services/data/project.service';
import { Project } from '../../../_models/project';
import { DslComment } from '../../../_models/dsl-comment';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { User } from 'src/app/_models/user';
import { DslToastrService } from '../../../_services/dsl-toastr.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  isPosting: boolean;
  isLogin = false;
  isComments = false;
  isLoading: boolean;
  firstFormGroup: FormGroup;
  commentForm: FormGroup;
  dialog_msg: string;
  comments: DslComment[];
  userInitials: any;
  user: User;

  constructor(private _formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public project: Project,
              public dialogRef: MatDialogRef<CommentsComponent>,
              private authenticationService: AuthenticationService,
              private domSanitizer: DomSanitizer,
              private localStorageService: LocalStorageService,
              private projectService: ProjectService,
              private dslToastrService: DslToastrService) {
  }

  ngOnInit() {
    this.commentForm = this._formBuilder.group({
      user_msg: [''],
    });
    this.firstFormGroup = this._formBuilder.group({
      user_name: [''],
      user_password: [''],
    });
    this.getComments();

    this.authenticationService.loggedIn
      .subscribe((userIsLoggedIn) => {
        this.isLogin = !userIsLoggedIn;
        this.isPosting = userIsLoggedIn;
        if (userIsLoggedIn) {
          this.user = this.localStorageService.getUser();
        } else {
          this.user = null;
        }
      });
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getComments() {
    if (this.project.comments.length > 0) {
      this.isComments = true;
      this.comments = this.project.comments;
    }
    this.user = this.localStorageService.getUser();
    if (!this.user) {
      this.isPosting = false;
      this.isLogin = true;
      this.dialog_msg = 'Log in with your Ericsson signum to post a comment';
    } else {
      this.isPosting = true;
      this.isLogin = false;
      this.dialog_msg = 'You can add your comment below to start the discussion';
    }

  }

  private createInitials(userDisplayName: string): string {
    return userDisplayName
      .split(' ')
      .map(n => n[0])
      .join('');
  }

  enterToLogin(event: any) {
    if (event.keyCode === 13) {
      this.onLogin();
    }
  }

  onPostComment() {
    if (this.commentForm.get('user_msg').value !== '') {
      const _usrComment = new DslComment();
      _usrComment.user = this.user._id;
      _usrComment.fullname = this.user.displayName;
      _usrComment.initials = this.createInitials(this.user.displayName);
      _usrComment.message = this.commentForm.get('user_msg').value;
      _usrComment.created = new Date();

      this.projectService.addComment(this.project._id, _usrComment)
        .then((updatedProject) => {
          this.project.comments = updatedProject.comments;
          this.project.votes = updatedProject.votes;
          this.isComments = true;
          this.comments = this.project.comments;
          this.commentForm.get('user_msg').setValue('');
        })
        .catch((error) => {
          console.log(`Error updating project: ${error}`);
          this.dslToastrService.error(
            'There was a problem posting your comment, please try again later.',
            'Comment Failed',
          );
        });
    }
  }

  deleteComment(commentToDelete: DslComment) {
    if (commentToDelete.user === this.user._id) {
      this.projectService.deleteComment(this.project._id, commentToDelete)
        .then((updatedProject) => {
          this.project.comments = updatedProject.comments;
          this.project.votes = updatedProject.votes;
          this.comments = this.project.comments;
          if (this.project.comments.length === 0) {
            this.isComments = false;
          }
        })
        .catch((error) => {
          console.log(`Error updating project: ${error}`);
          this.dslToastrService.error(
            'There was a problem posting your comment, please try again later.',
            'Comment Failed',
          );
        });
    } else {
      console.error('Only the creator of the comment can delete it!');
    }
  }

  onLogin() {
    this.isLoading = true;
    this.authenticationService
      .login(
        this.firstFormGroup.get('user_name').value,
        this.firstFormGroup.get('user_password').value,
      )
      .subscribe(
        () => { // data
        },
        () => { // error
          this.isLoading = false;
        },
        () => {
          this.isPosting = true;
          this.isLogin = false;
          this.isLoading = false;
        },
      );
  }

}
