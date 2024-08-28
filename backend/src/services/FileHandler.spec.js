import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import klawSync from 'klaw-sync';

import FileHandler from './FileHandler';
import ProjectData from '../test/data/ProjectData';
import UserData from '../test/data/UserData';
import ProjectFilesData from '../test/data/ProjectFilesData';

const zippedProject = 'testProject.zip';
const unzippedProjectName = path.parse(zippedProject).name;
const zipLocation = path.join(ProjectFilesData.uniqueDir, zippedProject);
const unzippedProjectLocation = path.join(ProjectFilesData.uniqueDir, unzippedProjectName);


describe('FileHander', () => {

  describe('cleanTmp', () => {

    it('should delete any subfolders within the user\'s tmp/{signum} folder', () => {
      //arrange
      fse.ensureDirSync(ProjectFilesData.uniqueDir);

      //act
      FileHandler.cleanTmp(UserData.userId);

      //assert
      expect(fs.existsSync(ProjectFilesData.uniqueDir))
        .toBe(false);
      fse.removeSync(ProjectFilesData.userDir);
    });

  });

  describe('findProjectFiles', () => {

    beforeEach(() => {
      ProjectFilesData.setUpFullProject();
    });

    it('should get the project files with the allowed extensions', () => {
      return new Promise((resolve, reject) => {

        let expectedIpynbFile1Result = path.join(path.sep, ProjectData.projectName, ProjectFilesData.ipynbFile1);
        let expectedIpynbFile2Result = path.join(path.sep, ProjectData.projectName, ProjectFilesData.subDirName, ProjectFilesData.ipynbFile2);
        let expectedJavaFileResult = path.join(path.sep, ProjectData.projectName, ProjectFilesData.subDirName, ProjectFilesData.javaFile);

        FileHandler.findProjectFiles(ProjectFilesData.uniqueDir, ['.ipynb', '.java'])
          .then((results) => {
            expect(results.findIndex((path) => path === expectedIpynbFile1Result)).toBeGreaterThan(-1);
            expect(results.findIndex((path) => path === expectedIpynbFile2Result)).toBeGreaterThan(-1);
            expect(results.findIndex((path) => path === expectedJavaFileResult)).toBeGreaterThan(-1);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });

      });
    });

    it('should get the project name if no files exist with the allowed extensions', () => {
      return new Promise((resolve, reject) => {

        FileHandler.findProjectFiles(ProjectFilesData.uniqueDir, ['.fakeExt'])
          .then((results) => {
            expect(results[0]).toEqual(ProjectData.projectName);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });

      });
    });

    afterEach(() => {
      fse.removeSync(ProjectFilesData.userDir);
    });

  });

  describe('findProjectFiles', () => {

    it('should fail if no project folder exists', () => {
      return new Promise((resolve, reject) => {

        //ensure no project folder exists
        fse.removeSync(ProjectFilesData.projectBaseDir);

        FileHandler.findProjectFiles(ProjectFilesData.uniqueDir, ['.ipynb'])
          .then(() => {
            reject('findProjectFiles() did not fail!');
          })
          .catch((error) => {
            resolve();
          });

      });
    });

    it('should fail if multiple folders exist where the project base folder should be', () => {
      return new Promise((resolve, reject) => {

        fse.ensureDirSync(ProjectFilesData.projectBaseDir);
        let secondBaseDir = path.join(ProjectFilesData.uniqueDir, 'otherBaseDir');
        fse.mkdirSync(secondBaseDir);

        FileHandler.findProjectFiles(ProjectFilesData.uniqueDir, ['.ipynb'])
          .then(() => {
            fse.removeSync(ProjectFilesData.userDir);
            reject('findProjectFiles() did not fail!');
          })
          .catch((error) => {
            fse.removeSync(ProjectFilesData.userDir);
            resolve();
          });

      });
    });

  });

  describe('findFiles', () => {

    beforeEach(() => {
      ProjectFilesData.setUpFullProject();
    });


    it('should find all files with allowed extensions', () => {
      return new Promise((resolve, reject) => {

        let listOfPaths = [];
        let expectedIpynbFile1Result = path.join(path.sep, ProjectData.projectName, ProjectFilesData.ipynbFile1);
        let expectedIpynbFile2Result = path.join(path.sep, ProjectData.projectName, ProjectFilesData.subDirName, ProjectFilesData.ipynbFile2);
        let expectedJavaFileResult = path.join(path.sep, ProjectData.projectName, ProjectFilesData.subDirName, ProjectFilesData.javaFile);

        FileHandler.findFiles(ProjectFilesData.uniqueDir, ['.ipynb', '.java'])
          .on('data', (item) => {
            listOfPaths.push(item);
          })
          .on('error', (err) => {
            reject("There was an error finding the files: " + err);
          })
          .on('end', () => {
            expect(listOfPaths.findIndex((path) => path === expectedIpynbFile1Result)).toBeGreaterThan(-1);
            expect(listOfPaths.findIndex((path) => path === expectedIpynbFile2Result)).toBeGreaterThan(-1);
            expect(listOfPaths.findIndex((path) => path === expectedJavaFileResult)).toBeGreaterThan(-1);
            resolve();
          });

      });

    });

    it('should exclude files that do not have allowed extensions', () => {
      return new Promise((resolve, reject) => {

        let listOfPaths = [];
        let expectedTxtFileResult = path.join(path.sep, ProjectData.projectName, ProjectFilesData.txtFile);

        FileHandler.findFiles(ProjectFilesData.uniqueDir, ['.ipynb', '.java'])
          .on('data', (item) => {
            listOfPaths.push(item);
          })
          .on('error', (err) => {
            reject("There was an error finding the files: " + err);
          })
          .on('end', () => {
            expect(listOfPaths.findIndex((path) => path === expectedTxtFileResult)).toEqual(-1);
            resolve();
          });

      });

    });

    afterEach(() => {

      fse.removeSync(ProjectFilesData.userDir);

    });

  });

  describe('getBaseProjectDir', () => {

    beforeEach(() => {
      fse.ensureDirSync(ProjectFilesData.projectBaseDir);
    });

    it(`It should retrieve the name of the project's base folder`, () => {
      return new Promise((resolve, reject) => {

        let list = [];

        FileHandler.getProjectBaseDir(ProjectFilesData.uniqueDir)
          .on('data', (result) => {
            list.push(result);
          })
          .on('error', (err) => {
            reject(err)
          })
          .on('end', () => {
            expect(list[0]).toEqual(ProjectData.projectName);
            resolve();
          });
      });
    });

    afterEach(() => {

      fse.removeSync(ProjectFilesData.userDir);

    });

  });

  describe('checkSizeOfUnzippedProject', () => {

    beforeEach(() => {
      fse.ensureDirSync(ProjectFilesData.uniqueDir);
      fse.writeFileSync(zipLocation);
    });

    it('should accept decompressed projects less than 30MB in size', () => {
      fse.writeFileSync(unzippedProjectLocation);
      FileHandler.checkSizeOfUnzippedProject(ProjectFilesData.uniqueDir, zippedProject, UserData.userId, ProjectFilesData.uniqueId);
      expect(fs.existsSync(zipLocation)).toBe(false); //We expect zip file to be removed
      expect(fs.existsSync(unzippedProjectLocation)).toBe(true); //We expect unzipped project to remain

      fse.removeSync(ProjectFilesData.userDir);
    });

    it('should reject decompressed projects greater than 30MB in size', () => {
      fs.writeFileSync(unzippedProjectLocation, new Buffer(1024*1024*30));
      expect(() => FileHandler.checkSizeOfUnzippedProject(ProjectFilesData.uniqueDir, zippedProject, UserData.userId, ProjectFilesData.uniqueId)).toThrow(new Error('This project exceeds decompressed limit!'));
      let directoryContent = klawSync(ProjectFilesData.uniqueDir);
      expect(directoryContent.length).toEqual(0); //We expect that the uniqueDir will be emptied of the disallowed files

      fse.removeSync(ProjectFilesData.userDir);
    });

  });

});
