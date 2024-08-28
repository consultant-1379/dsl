import path from 'path';
import fse from 'fs-extra';
import klawSync from 'klaw-sync';
import request from 'supertest';

import TestConfig from './testConfig';
import ProjectData from './data/ProjectData';
import UserData from './data/UserData';
import ProjectFilesData from './data/ProjectFilesData';

describe('fileManager', () => {
  describe('ls', () => {
    it('should return all .ipynb files', () => new Promise((resolve, reject) => {
      ProjectFilesData.setUpFullProject();

      const expectedIpynbFile1Result = path.join(path.sep, ProjectData.projectName, ProjectFilesData.ipynbFile1);
      const expectedIpynbFile2Result = path.join(path.sep, ProjectData.projectName, ProjectFilesData.subDirName, ProjectFilesData.ipynbFile2);

      request(TestConfig.getBackendAddress())
        .get(`fileManager/ls/${UserData.userId}/${ProjectFilesData.uniqueId}`)
        .expect(200)
        .then((response) => {
          const results = response.body;

          expect(results.findIndex(path => path === expectedIpynbFile1Result)).toBeGreaterThan(-1);
          expect(results.findIndex(path => path === expectedIpynbFile2Result)).toBeGreaterThan(-1);

          fse.removeSync(ProjectFilesData.userDir);

          resolve();
        });
    }));

    it('should return a 500 error response if the project does not exist', () => new Promise((resolve, reject) => {
      const nonExistingUser = 'nonExistingUser';

      request(TestConfig.getBackendAddress())
        .get(`fileManager/ls/${UserData.userId}/${ProjectFilesData.uniqueId}`)
        .expect(500)
        .then(() => {
          resolve();
        });
    }));
  });

  describe('mkdir', () => {
    it('should create the user directory', () => {
      // make sure userDir does not already exist
      fse.removeSync(ProjectFilesData.userDir);

      return new Promise((resolve, reject) => {
        request(TestConfig.getBackendAddress())
          .post('fileManager/mkdir')
          .send({
            username: UserData.userId,
            uniqueid: ProjectFilesData.uniqueId,
          })
          .set('Accept', 'application/json')
          .expect(200)
          .then(() => {
            expect(fse.existsSync(ProjectFilesData.userDir)).toEqual(true);
            fse.removeSync(ProjectFilesData.userDir);
            resolve();
          });
      });
    });
  });


  describe('rm', () => {
    it('should empty the unique directory for uploads', () => {
      fse.ensureDirSync(ProjectFilesData.uniqueDir);
      const filePath = path.join(ProjectFilesData.uniqueDir, 'myFile.txt');
      fse.writeFileSync(filePath, 'File contents');

      return new Promise((resolve, reject) => {
        request(TestConfig.getBackendAddress())
          .delete(`fileManager/rm/${UserData.userId}/${ProjectFilesData.uniqueId}`)
          .expect(200)
          .then(() => {
            const paths = klawSync(ProjectFilesData.uniqueDir);
            expect(paths.length).toEqual(0);

            fse.removeSync(ProjectFilesData.userDir);
            resolve();
          });
      });
    });

    it('should return a 500 status code if the specified directory does not exist', () => new Promise((resolve, reject) => {
      const nonExistingUniqueDir = 'nonExistingUniqueDir';

      request(TestConfig.getBackendAddress())
        .delete(`fileManager/rm/${UserData.userId}/${nonExistingUniqueDir}`)
        .expect(500)
        .then(() => {
          resolve();
        });
    }));
  });
});
