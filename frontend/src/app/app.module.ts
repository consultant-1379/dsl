import { ConfigService, ConfigModule } from './_services/config.service';
declare var require: any;
// declare var PouchDB: any;

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FilePondModule, registerPlugin } from 'ngx-filepond';

// import and register filepond file type and size validation plugin
import filepondPluginFileValidateType from 'filepond-plugin-file-validate-type'; // tslint:disable-line
import filepondPluginFileValidateSize from 'filepond-plugin-file-validate-size'; // tslint:disable-line
registerPlugin(filepondPluginFileValidateType, filepondPluginFileValidateSize);

import { MaterialModule } from './material.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MarkdownModule } from 'ngx-markdown';
import { AceEditorModule } from 'ng2-ace-editor';
import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService } from './_services//authentication-service/authentication.service';
import { GitService } from './_services/git.service';
import { ProjectService } from './_services/data/project.service';
import { UserService } from './_services/data/user.service';
import { BackendService } from './_services/backend/backend.service';
import { ProjectCreationService } from './_services/workspace-services/project-creation/project-creation.service';
import { LivenessService } from './_services/liveness/liveness.service';
import { LocalStorageService } from './_services/local-storage.service';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { routing } from './app.routing';
import { ProjectsComponent } from './projects/projects.component';
import { CreateComponent } from './projects/create/create.component';
import { HeroboxComponent } from './home/herobox/herobox.component';
import { CommentsComponent } from './shared/dialogs/comments/comments.component';
import { PapaParseModule, PapaParseService } from 'ngx-papaparse';
import { FooterComponent } from './shared/footer/footer.component';
import { UserProjectsComponent } from './projects/user-projects/user-projects.component';
import { WsToolbarComponent } from './projects/ws-toolbar/ws-toolbar.component';
import { UploadComponent } from './projects/upload/upload.component';
import { CanDeactivateGuard } from './_guards/can-deactivate.guard';
import { DialogService } from './_guards/dialog.service';
import { VotingService } from './_services/data/voting.service';
import { ProjectCardComponent } from './projects/project-card/project-card.component';
import { ProjectCardToolsComponent } from './projects/project-card/project-card-tools/project-card-tools.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ProjectDetailsComponent } from './projects/project-details/project-details.component';
import { AllProjectsComponent } from './projects/all-projects/all-projects.component';
import { HashtagChipListComponent } from './shared/hashtag-chip-list/hashtag-chip-list.component';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { FileSystemItemComponent } from './file-selector/file-system-item/file-system-item.component';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmDeleteComponent } from '../app/projects/delete.dialog.component';
import { LivenessErrorHandlingService } from './_services/liveness/liveness-error-handling.service';
import { LivenessErrorComponent } from './shared/liveness-error/liveness-error.component';
import { JwtInterceptor } from './_services/authentication-service/jwt.interceptor';
import { DslToastrService } from './_services/dsl-toastr.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    FilePondModule,
   // ModalModule.forRoot(),
    MaterialModule,
    MatIconModule,
    MatChipsModule,
    MarkdownModule.forRoot(),
    // NgSlimScrollModule,
    AceEditorModule,
    // MarkdownToHtmlModule.forRoot(),
    PapaParseModule,
    routing,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    MatProgressSpinnerModule,
  ],
  declarations: [
    AppComponent,
    // ModalComponent,
    HeaderComponent,
    LoginComponent,
    HomeComponent,
    ProjectsComponent,
    CreateComponent,
    HeroboxComponent,
    CommentsComponent,
    FooterComponent,
    UserProjectsComponent,
    WsToolbarComponent,
    UploadComponent,
    ProjectCardComponent,
    ProjectCardToolsComponent,
    ProjectListComponent,
    ProjectDetailsComponent,
    AllProjectsComponent,
    HashtagChipListComponent,
    FileSelectorComponent,
    FileSystemItemComponent,
    ConfirmDeleteComponent,
    LivenessErrorComponent,
  ],
  entryComponents: [LoginComponent, CommentsComponent, ConfirmDeleteComponent],
  providers: [
    // ModalService,
    AuthGuard,
    CanDeactivateGuard,
    AuthenticationService,
    GitService,
    LocalStorageService,
    ProjectsComponent,
    DialogService,
    PapaParseService,
    ConfigService,
    ProjectCreationService,
    ConfigModule.init(),
    LivenessService,
    LivenessErrorHandlingService,
    ProjectService,
    UserService,
    BackendService,
    VotingService,
    DslToastrService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
// RouterModule.forRoot(AppRoutes)
