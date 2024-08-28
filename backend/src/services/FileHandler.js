/* ============================================================================
 * Ericsson Data Science Lounge Backend
 *
 * FileHandler.js - A utility class to help with uploaded files.
 * ============================================================================
 */
import AdmZip from 'adm-zip';
import fse from 'fs-extra';
import mkdirp from 'mkdirp';
import klawSync from 'klaw-sync';
import path from 'path';
import through2 from 'through2';
import klaw from 'klaw';
import fsUtils from 'nodejs-fs-utils';
import logger from './logger';

const BASEDIR = 'tmp/'; // TODO: Extract config parameter

// TODO: think about security implications of this class.

export default class FileHandler {
  /*
   * Unzip the zipfile to the specified location.
   */
  static unzipFile(userDir, zipFileName) {
    const zipFile = new AdmZip(userDir + zipFileName);
    // FIXME: Can't unzip file, error handling etc.
    zipFile.extractAllTo(userDir, true);
  }

  /*
   * Creates a directory.
   */
  static createUserDirectory(userDirPath) {
    const fullPath = path.join(BASEDIR, userDirPath, path.sep);
    mkdirp(fullPath, (err) => {
      if (err) {
        logger.error('error', err);
      } else {
        logger.info(`User directory ${fullPath} successfully created!`);
      }
    });
  }

  /*
   * This will check if the file is a zip file or not
   */
  static checkAndUnzipFile(file, userId, uniqueId) {
    const fileName = file[0].originalname;
    const userDir = path.join(BASEDIR, userId, uniqueId, path.sep);

    logger.info(`Checking filename: ${fileName}`);
    if (path.extname(fileName) === '.zip') {
      logger.info(`Got a valid ZIP file: ${fileName}`);
      FileHandler.unzipFile(userDir, fileName); // unzipfile
      FileHandler.checkSizeOfUnzippedProject(userDir, fileName, userId, uniqueId);
    } else {
      logger.error(`Got an invalid file: ${fileName}`);
    }
  }

  /*
   * This will check if the unzipped project is within the max allowed size or not
   */
  static checkSizeOfUnzippedProject(userDir, fileName, userId, uniqueId) {
    const unzippedFolder = path.parse(fileName).name;
    const unzippedFolderSize = fsUtils.fsizeSync(path.join(userDir, unzippedFolder));
    if (unzippedFolderSize > 30000000) {
      logger.error(`${unzippedFolder} is ${unzippedFolderSize} Bytes in size. This project exceeds decompressed limit!`);
      this.cleanUnique(userId, uniqueId);
      throw new Error('This project exceeds decompressed limit!');
    } else {
      logger.info(`${unzippedFolder} is under the size limit`);
      fse.removeSync(path.join(userDir, fileName));
    }
  }

  /*
   * Copy files to project folder.
   */
  static addFilesToRepo(fileSourcePath, fileDestPath) {
    logger.info(`Adding all files from ${fileSourcePath}to ${fileDestPath}`);

    // FIXME: No error handling.
    fse.copySync(fileSourcePath, fileDestPath);
    fse.removeSync(fileSourcePath);
  }

  // TODO: Make generic delete dir method.

  /*
   * Cleans the tmp of the user's files when user cancels
   */
  static cleanTmp(userId) {
    // Note basic removal when the user clicks cancel button
    // Needs to be futher Handled.
    const userdir = path.join(BASEDIR, userId, path.sep);
    const paths = klawSync(userdir);
    paths.forEach((entryInPaths) => {
      logger.info(`Deleting: ${entryInPaths.path}`);
      fse.removeSync(entryInPaths.path);
    });
  }

  /*
   * Clears the user directory
   */
  static cleanUnique(userId, uniqueId) {
    const dir = path.join(BASEDIR, userId, uniqueId, path.sep);
    const paths = klawSync(dir);
    paths.forEach((entryInPaths) => {
      logger.info(`Deleting: ${entryInPaths.path}`);
      fse.removeSync(entryInPaths.path);
    });
  }

  static findProjectFiles(rootDirectory, allowedExtensions) {
    /* returns a promise containing either a list of the all files in the project
     * matching the allowedExtensions, or the name of the base folder for the
     * project if no files are found
     */
    return new Promise((resolve, reject) => {
      const list = [];

      this.findFiles(rootDirectory, allowedExtensions)
        .on('data', (item) => {
          logger.info(`Retrieved: ${item}`);
          list.push(item);
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          if (list.length > 0) {
            resolve(list);
          } else {
            /* no files with allowedExtensions have been found,
             * instead return the base folder for the project.
             */
            this.getProjectBaseDir(rootDirectory)
              .on('data', (item) => {
                list.push(item);
              })
              .on('error', (err) => {
                reject(err);
              })
              .on('end', () => {
                if (list.length === 1) {
                  resolve(list);
                } else {
                  reject(new Error(`Could not retrieve the name of the project base folder because ${
                    list.length} folders exist at that location (${path.resolve(rootDirectory)})`));
                }
              });
          }
        });
    });
  }

  static findFiles(walkPath, allowedExtensions) {
    // recursively searches the rootDirectory for files whose extensions match allowedExtensions.
    // returns a readable stream of relative paths to those files.

    const absoluteWalkPath = path.resolve(walkPath);

    // Filter excludes directories and any files not in allowedExtensions
    /* eslint-disable func-names */
    const excludeFilter = through2.obj(function (item, enc, next) {
      const extension = path.extname(item.path);
      if (!item.stats.isDirectory() && allowedExtensions.includes(extension)) {
        this.push(item.path.split(absoluteWalkPath).pop());
      }
      next();
    });

    return klaw(walkPath)
      .on('error', (err) => {
        logger.error('There was an error trying to find the files.');
        excludeFilter.emit('error', err); // forward the error onwards, otherwise it will not propagate beyond the pipe
      })
      .pipe(excludeFilter);
  }

  static getProjectBaseDir(walkPath) {
    /* retrieves the name of the base directory for the project by searching
     * its containing directory
     */

    const absoluteWalkPath = path.resolve(walkPath);

    // filter to exclude the containing directory from the klaw results
    /* eslint-disable func-names */
    const excludeFilter = through2.obj(function (item, enc, next) {
      if (item.path.split(absoluteWalkPath).pop()) {
        this.push(item.path.split(absoluteWalkPath + path.sep).pop());
      }
      next();
    });

    return klaw(walkPath, { depthLimit: 0 })
      .on('error', (err) => {
        logger.error('There was an error trying to retrieve the base directory of the project.');
        excludeFilter.emit('error', err); // forward the error onwards, otherwise it will not propagate beyond the pipe
      })
      .pipe(excludeFilter);
  }
}

module.exports = FileHandler;
