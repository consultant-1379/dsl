import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsComponent } from './comments.component';
import { NO_ERRORS_SCHEMA, InjectionToken, DebugElement } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Project } from 'src/app/_models/project';
import { ProjectService } from 'src/app/_services/data/project.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthenticationService } from '../../../_services/authentication-service/authentication.service';
import { DomSanitizer, By } from '@angular/platform-browser';
import { LocalStorageService } from '../../../_services/local-storage.service';
import { DslComment } from '../../../_models/dsl-comment';
import { User } from 'src/app/_models/user';
import { DslToastrService } from 'src/app/_services/dsl-toastr.service';

describe('CommentComponent', () => {

  describe('deleteComments', () => {
    let commentsComponent: CommentsComponent;

    const projectService = jasmine.createSpyObj('ProjectService', ['deleteComment']);
    projectService.deleteComment.and.returnValue(Promise.resolve());

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          CommentsComponent,
          { provide: ProjectService, useValue: projectService },
          { provide: FormBuilder, useValue: {} },
          { provide: MatDialogRef, useValue: {} },
          { provide: AuthenticationService, useValue: {} },
          { provide: DomSanitizer, useValue: {} },
          { provide: LocalStorageService, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: new Project() },
          { provide: DslToastrService, useValue: {} },
        ],
      });

      commentsComponent = TestBed.get(CommentsComponent);
    });

    it('should only allow the user who created the comment to delete it', () => {
      commentsComponent.project.comments = getSampleComments();
      commentsComponent.user = getCreatorOfSecondComment();
      commentsComponent.deleteComment(commentsComponent.project.comments[2]);
      expect(projectService.deleteComment).toHaveBeenCalledTimes(0);
    });

  });

});

function getSampleComments() {
  let sampleComments: DslComment[];
  const comment1 = new DslComment();
  const comment2 = new DslComment();
  const comment3 = new DslComment();

  comment1.created = new Date(2018, 10, 1);
  comment1.fullname = 'John Doe';
  comment1.initials = 'JD';
  comment1.message = 'First Message';
  comment1.user = 'edoejoh';

  comment2.created = new Date(2017, 9, 13);
  comment2.fullname = 'Mary May';
  comment2.initials = 'MM';
  comment2.message = 'Second Message';
  comment2.user = 'emaymar';

  comment3.created = new Date(2015, 11, 1);
  comment3.fullname = 'Bill Baggins';
  comment3.initials = 'BB';
  comment3.message = 'Third Message';
  comment3.user = 'ebagbil';

  sampleComments = [comment1, comment2, comment3];

  return sampleComments;

}

function getCreatorOfSecondComment() {
  const user = new User();
  user._id = 'emaymar';
  user.displayName = 'Mary May';
  user.email = 'example@test.com';
  user.modified = new Date(2014, 11, 1);
  user.type = 'user';
  user.visits = 0;
  return user;
}
