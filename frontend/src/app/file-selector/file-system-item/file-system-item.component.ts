import { Component, OnInit, Input } from '@angular/core';
import { FileSystemItem } from '../file-system-item';
import { SelectedFileService } from '../selected-file/selected-file.service';

@Component({
  selector: 'app-file-system-item',
  templateUrl: './file-system-item.component.html',
  styleUrls: ['./file-system-item.component.scss'],
})
export class FileSystemItemComponent implements OnInit {

  readonly DIRECTORY: string = 'directory';
  readonly FILE: string = 'file';

  @Input() fileSystemItem: FileSystemItem;
  @Input() path = '';
  type = '';
  isNotebook: boolean;

  constructor(private selectedFileService: SelectedFileService) { }

  ngOnInit() {
    this.setType();
  }

  private setType() {
    if (this.fileSystemItem.children.length === 0) {
      this.type = this.FILE;
      this.checkIfFileIsANotebook();
    } else {
      this.type = this.DIRECTORY;
    }
  }

  private checkIfFileIsANotebook() {
    this.isNotebook = (this.fileSystemItem.name.endsWith('.ipynb'));
  }

  setSelectedFile() {
    this.selectedFileService.setSelectedFile(`${this.path}/${this.fileSystemItem.name}`);
  }
}
