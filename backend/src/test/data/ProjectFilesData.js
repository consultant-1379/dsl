import path from 'path';
import fse from 'fs-extra';
import ProjectData from './ProjectData';
import UserData from './UserData';

function ProjectFilesData() {
  this.uniqueId = 'testuser-1234567';
  this.tmpDir = path.join('.', 'tmp');
  this.subDirName = 'subDir';
  this.userDir = path.join(this.tmpDir, UserData.userId);
  this.uniqueDir = path.join(this.tmpDir, UserData.userId, this.uniqueId);
  this.projectBaseDir = path.join(this.uniqueDir, ProjectData.projectName);
  this.subDir = path.join(this.projectBaseDir, this.subDirName);

  this.ipynbFile1 = 'file1.ipynb';
  this.ipynbFile2 = 'file2.ipynb';
  this.javaFile = 'file.java';
  this.txtFile = 'file.txt';

  this.pathToIpynbFile1 = path.join(this.projectBaseDir, this.ipynbFile1);
  this.pathToIpynbFile2 = path.join(this.subDir, this.ipynbFile2);
  this.pathToJavaFile = path.join(this.subDir, this.javaFile);
  this.pathToTxtFile = path.join(this.projectBaseDir, this.txtFile);

  this.setUpFullProject = () => {
    fse.ensureDirSync(this.projectBaseDir);
    fse.ensureDirSync(this.subDir);

    fse.writeFileSync(this.pathToIpynbFile1, 'File contents');
    fse.writeFileSync(this.pathToIpynbFile2, 'File contents');
    fse.writeFileSync(this.pathToJavaFile, 'File contents');
    fse.writeFileSync(this.pathToTxtFile, 'File contents');
  };
}
export default new ProjectFilesData();
