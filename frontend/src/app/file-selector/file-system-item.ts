export class FileSystemItem {
    // This class represents either a directory or a file.
    // FileSystemItems with no children are assumed to be a file.
  name = '';
  children: FileSystemItem[] = [];
}
