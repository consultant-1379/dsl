// FIXME: Messy FilePond initialization.

import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ConfigService } from '../../_services/config.service';
import { User } from 'src/app/_models/user';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { BackendService } from 'src/app/_services/backend/backend.service';
import { ToastrService } from 'ngx-toastr';
import { LivenessErrorHandlingService } from 'src/app/_services/liveness/liveness-error-handling.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {

  @ViewChild('myPond') myPond: any;
  @Input() uniqueId: string; // unique name given to the temporary folder containing the uploaded files on the backend
  @Output() saveFile: EventEmitter<any> = new EventEmitter<any>();
  @Output() fileUploaded: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() fileUploadUndone: EventEmitter<any> = new EventEmitter<any>();
  fileList: string[] = [];
  user: User;
  jwtToken: string;

  pondOptions = {
    class: 'my-filepond',
    multiple: false,
    labelIdle: 'Drop zip file here',
    allowFileTypeValidation: true,
    acceptedFileTypes: [
      'application/x-zip-compressed',
    ],
    fileValidateTypeLabelExpectedTypesMap: {
      'application/x-zip-compressed' : '.zip',
    },
    allowFileSizeValidation: true,
    maxFileSize: '20MB',
    labelMaxFileSize: 'Maximum file size is {filesize}',
    required: true,
    instantUpload: true,
    server: {
      url: '',
      process: {
        url: '',
        method: 'POST',
        withCredentials: false,
        headers: {
          'Access-Control-Allow-Origin' : '*',
          Authorization: '', // FIXME: Ugly hack
        },
        timeout: 5000,
        // this stops filepond from sending the response from the upload as part of the the request for reverting the upload
        onload: (() => { this.getFileList(); }),
        onerror: ((response) => {
          this.livenessErrorHandlingService.checkForLivenessError();
          try {
            console.log(`//////// ${JSON.stringify(response)}`);
            const parsedResponse = JSON.parse(response);
            if (parsedResponse.errorMessage) {
              this.toastr.error(
                parsedResponse.errorMessage,
                'Upload Failed',
                {
                  timeOut: 5000,
                  progressBar: true,
                  positionClass: 'toast-top-center',
                });
            }
          } catch (error) {
            console.error(`ERROR! ${error}`);
          }
        }),
      },
      revert: {
        url: '',
        method: 'DELETE',
        withCredentials: false,
        headers: {
          'Access-Control-Allow-Origin' : '*',
          Authorization: '', // FIXME: Ugly hack
        },
        timeout: 5000,
      },
    },
  };

  pondFiles = [];

  pondHandleInit() {
    console.log('FilePond has initialised', this.myPond);
  }

  pondHandleAddFile(event: any) {
    console.log('A file was added', event);
  }

  getFileList() {
    this.backendService.getUploadedFiles(this.user._id, this.uniqueId)
      .subscribe((data) => {
        this.fileUploaded.emit(data);
      });

  }

  onremovefile() {
    // the user has clicked the undo button on file pond
    this.fileUploadUndone.emit();
  }

  constructor(private backendService: BackendService,
              private configService: ConfigService,
              private localStorageService: LocalStorageService,
              private toastr: ToastrService,
              private livenessErrorHandlingService: LivenessErrorHandlingService) {
  }

  ngOnInit() {
    // Configure the URL for the DSL backend.
    this.pondOptions.server.url = this.configService.getDSLBackendDetails('URL');
    this.user = this.localStorageService.getUser();
    this.jwtToken = this.localStorageService.getJwtToken();
    this.pondOptions.server.process.headers.Authorization = `Bearer ${this.jwtToken}`; // FIXME: Ugly Hack
    this.pondOptions.server.revert.headers.Authorization = `Bearer ${this.jwtToken}`; // FIXME: Ugly Hack
    this.pondOptions.server.process.url = `/project/upload/${this.user._id}/${this.uniqueId}`;
    this.pondOptions.server.revert.url = `/fileManager/rm/${this.user._id}/${this.uniqueId}`;
  }
}
