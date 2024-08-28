import { Component, OnInit, Input } from '@angular/core';
import { FileSystemItem } from './file-system-item';
import { SelectedFileService } from './selected-file/selected-file.service';
import { IFileSystemItemAdapter } from './file-system-item-adapter/IFileSystemItemAdapter';
import { FileSystemItemAdapter } from './file-system-item-adapter/fileSystemItemAdapter';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss'],
  providers: [SelectedFileService],
})
export class FileSelectorComponent implements OnInit {

  directory: FileSystemItem = new FileSystemItem();
  @Input() fileSystemItemAdapter: IFileSystemItemAdapter;

  constructor(private selectedFileService: SelectedFileService) { }

  ngOnInit() {
    if (!this.fileSystemItemAdapter) {
      this.fileSystemItemAdapter = new FileSystemItemAdapter(['sampleFolder/']);
    }
    this.directory = this.fileSystemItemAdapter.getFileSystemItem();
  }

  public getPathToFile() {
    return this.selectedFileService.getSelectedFile();
  }

  public setFileSystemItemAdapter(newFileSystemItemAdapter: IFileSystemItemAdapter) {
    this.fileSystemItemAdapter = newFileSystemItemAdapter;
    this.directory = this.fileSystemItemAdapter.getFileSystemItem();
  }

}
