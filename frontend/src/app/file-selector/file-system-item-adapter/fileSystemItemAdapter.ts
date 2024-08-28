import { IFileSystemItemAdapter } from './IFileSystemItemAdapter';
import { FileSystemItem } from '../file-system-item';

export class FileSystemItemAdapter implements IFileSystemItemAdapter {

  rawData: string[] = [];

  constructor(rawData: string[]) {
    this.rawData = rawData;
  }

  getFileSystemItem() {
    const rootFsi = new FileSystemItem();

    this.rawData.forEach((row) => {
      // Each row is string representing a path to a file e.g. '/tmp/folder1/folder2/myfile.ipynb'
      const rowResult = this.normalizeFileSeparators(row);
      this.insertRowIntoRootFsi(rowResult, rootFsi);
    });

    if (rootFsi.children.length === 1) {
            // in most cases the, rootFsi will only have one direct child. If that's the case, it makes sense to return that child
      return rootFsi.children[0];
    }

    return rootFsi;
  }

  private normalizeFileSeparators(row: string) {
        // if the backend is running on Windows, the rows will look like '\\tmp\\folder1\\folder2\\myfile.ipynb'
        // this function replaces all '\\' occurances with '/' for compatibility
    return row.split('\\').join('/');
  }

  private insertRowIntoRootFsi(rowAsString: string, rootFsi: FileSystemItem) {
    const row = rowAsString.split('/');
    let currentFsi = rootFsi;

    this.removeBlankItemsFromRow(row);
    this.removeTmpDirectoryFromRow(row);

    for (let i = 0; i < row.length; i += 1) {
      currentFsi = this.insertItemIntoFsi(row[i], currentFsi);
    }
  }

  private removeBlankItemsFromRow(row: string[]) {
    if (row[0] === '') {
      row.splice(0, 1);
    }
  }
  private removeTmpDirectoryFromRow(row: string[]) {
    if (row[0] === 'tmp') {
      row.splice(0, 1);
    }
  }

  private insertItemIntoFsi(fileOrDirectory: string, fsi: FileSystemItem): FileSystemItem {
    let newFsi = this.getChildFsiByName(fileOrDirectory, fsi);
    if (newFsi === null) {
            // the file or directory has not been created yet, we must create it
      newFsi = new FileSystemItem();
      newFsi.name = fileOrDirectory;
      fsi.children.push(newFsi);
    }
    return newFsi;
  }

  private getChildFsiByName(nameOfChild: string, parentFsi: FileSystemItem) {
    let result: FileSystemItem;
    let resultFound = false;
    parentFsi.children.forEach((child) => {
      if (child.name === nameOfChild) {
        result = child;
        resultFound = true;
      }
    });
    if (resultFound) {
      return result;
    }
    return null;
  }
}
