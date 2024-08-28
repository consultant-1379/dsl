import { FileSystemItem } from '../file-system-item';

export interface IFileSystemItemAdapter {
  getFileSystemItem(): FileSystemItem;
}
