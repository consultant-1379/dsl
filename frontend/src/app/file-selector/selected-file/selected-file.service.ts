import { Injectable } from '@angular/core';

@Injectable()
export class SelectedFileService {

  selectedFile = '';

  constructor() { }

  setSelectedFile(selectedFile: string) {
    this.selectedFile = selectedFile;
  }

  getSelectedFile(): string {
    return this.selectedFile;
  }
}
