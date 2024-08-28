import fse from 'fs-extra';
import path from 'path';
import request from 'supertest';

import TestConfig from './testConfig';
import ProjectData from './data/ProjectData';
import UserData from './data/UserData';
import ProjectFilesData from './data/ProjectFilesData';
import Gitlab from './utilities/Gitlab';

describe('project', () => {
  describe('upload', () => {
    it('should create a folder with the name of the zip file under your upload (unique) folder', () => new Promise((resolve, reject) => {
      fse.ensureDirSync(ProjectFilesData.uniqueDir);

      const zipFilePath = path.join('src', 'test', 'uploadSamples', 'test-project.zip');
      request(`${TestConfig.getBackendAddress()}`)
        .post(`project/upload/${UserData.userId}/${ProjectFilesData.uniqueId}`)
        .set('Authorization', 'Bearer ' + process.env.JWT_SECRET)
        .attach('file', zipFilePath)
        .expect(200)
        .then(() => {
          expect(fse.existsSync(path.join(ProjectFilesData.uniqueDir, 'test-project')))
            .toEqual(true);
          fse.removeSync(ProjectFilesData.userDir);
          resolve();
        });
    }));

    it('should successfully upload all files in the uploaded zip folder', () => new Promise((resolve, reject) => {
      fse.ensureDirSync(ProjectFilesData.uniqueDir);

      const zipFilePath = path.join('src', 'test', 'uploadSamples', 'test-project.zip');

      request(`${TestConfig.getBackendAddress()}`)
        .post(`project/upload/${UserData.userId}/${ProjectFilesData.uniqueId}`)
        .attach('file', zipFilePath)
        .expect(200)
        .then(() => {
          expect(fse.existsSync(ProjectFilesData.pathToIpynbFile1))
            .toEqual(true);
          expect(fse.existsSync(ProjectFilesData.pathToIpynbFile2))
            .toEqual(true);
          expect(fse.existsSync(ProjectFilesData.pathToJavaFile))
            .toEqual(true);
          expect(fse.existsSync(ProjectFilesData.pathToTxtFile))
            .toEqual(true);
          fse.removeSync(ProjectFilesData.userDir);
          resolve();
        });
    }));
  });

  describe('publish', () => {
    let userGitlabId;

    beforeEach(() => new Promise((resolve, reject) => {
      Gitlab.createGitlabUser()
        .then((gitlabId) => {
          userGitlabId = gitlabId;
          return ProjectFilesData.setUpFullProject();
        })
        .then(() => Gitlab.createRepositoryInGitlab(userGitlabId))
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(`Set up for publish test failed in beforeEach method: ${error}`);
        });
    }));

    it('should successfully publish a project', () => new Promise((resolve, reject) => {
      request(TestConfig.getBackendAddress())
        .post(`project/publish/${UserData.userId}/${ProjectFilesData.uniqueId}/${ProjectData.projectName}`)
        .send({
          _id: UserData.userId,
          email: 'test@test.com',
        })
        .expect(200)
        .then(() => {
          expect(fse.existsSync(ProjectFilesData.projectBaseDir))
            .toEqual(false);

          Gitlab.checkGitlabProjectExists()
            .then((projectExists) => {
              expect(projectExists)
                .toEqual(true);
              resolve();
            });
        })
        .catch((error) => {
          reject(error);
        });
    }));

    afterEach(() => new Promise((resolve, reject) => {
      fse.removeSync(ProjectFilesData.userDir);
      Gitlab.deleteGitlabUser(userGitlabId)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(`There was an error when trying to delete the test user from Gitlab in the afterEach() method: ${error}`);
        });
    }));
  });

  describe('cancel', () => {
    it('should remove the unique folders within the users directory', () => new Promise((resolve, reject) => {
      const uniqueDir1 = ProjectFilesData.uniqueDir;
      const uniqueDir2 = path.join(ProjectFilesData.userDir, 'unique2');

      fse.ensureDirSync(uniqueDir1);
      fse.ensureDirSync(uniqueDir2);

      request(TestConfig.getBackendAddress())
        .get(`project/cancel/${UserData.userId}`)
        .expect(200)
        .then(() => {
          expect(fse.existsSync(uniqueDir1))
            .toEqual(false);
          expect(fse.existsSync(uniqueDir2))
            .toEqual(false);
          fse.removeSync(ProjectFilesData.userDir);
          resolve();
        });
    }));

    it('should return a 500 error response if the user upload directory does not exist', () => new Promise((resolve, reject) => {
      const nonExistingUser = 'nonExistingUser';

      request(TestConfig.getBackendAddress())
        .get(`project/cancel/${nonExistingUser}`)
        .expect(500)
        .then(() => {
          resolve();
        });
    }));
  });
});
