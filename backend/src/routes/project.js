/* ============================================================================
 * Ericsson Data Science Lounge Backend
 *
 * project.js - Handles Project creation.
 * ============================================================================
 */
import bodyParser from 'body-parser';
import path from 'path';
import express from 'express';
import multer from 'multer';
import FileHandler from '../services/FileHandler';
import GitHandler from '../services/git/GitHandler';
import logger from '../services/logger';

const router = express.Router();

const TEMP_LOCATION = 'tmp'; // FIXME: Extract constant

/*
 * Initialize the multer and diskStorage.
 */
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(TEMP_LOCATION, req.params.userid, req.params.uniqueid,
        path.sep));
    },
    filename(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

/*
 * This is called when the user puts a file in the file dropzone.
 */
router.post('/upload/:userid/:uniqueid', upload.any(), (req, res) => {
  const userId = req.params.userid;
  const uniqueId = req.params.uniqueid;
  logger.log('info', `Handling upload request for userid ${userId}`);

  // FIXME: Error handling.
  try {
    FileHandler.checkAndUnzipFile(req.files, userId, uniqueId);
    res.writeHead(
      200,
      {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    );
    res.write('File added to tmp folder');
    res.end();
  } catch (error) {
    res.writeHead(
      400,
      {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    );
    res.write(JSON.stringify({ errorMessage: 'Folder too large to upload. Max decompressed size is 30MB.' }));
    res.end();
  }
});

/*
 * Creates a repository in GitLab and pushes uploaded files.
 */
router.post('/publish/:userid/:uniqueid/:projectname', bodyParser.json(), (req, res) => {
  (async () => {
    const userId = req.params.userid;
    const uniqueId = req.params.uniqueid;
    const projectName = req.params.projectname;
    const user = req.body;
    logger.log('info', `req.body = ${JSON.stringify(req.body)}`);
    const handleGit = new GitHandler();
    handleGit.setProjectName(projectName);
    handleGit.setUrl(userId);

    let repoDestinationPath = '';
    const fileSourcePath = path.join(TEMP_LOCATION, userId, uniqueId);
    handleGit.getRepo(userId, uniqueId)
      .then((repoPath) => {
        repoDestinationPath = repoPath;
        FileHandler.addFilesToRepo(fileSourcePath, repoDestinationPath, userId);
        return handleGit.commitInRepo(user, uniqueId);
      })
      .then(() => handleGit.pushToRepo(user, uniqueId))
      .then(() => {
        GitHandler.deleteRepoInLocal(userId);
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        res.end();
      })
      .catch((error) => {
        logger.log('error', `There was an error while trying to publish the project: ${error}`);
        res.status(500);
        res.send('There was an error publishing the project');
      });
  })();
});

/*
 * Cancels project upload and/or publication.
 */
router.get('/cancel/:userid', (req, res) => {
  logger.log('debug', `req.params.userid = ${req.params.userid}`);
  FileHandler.cleanTmp(req.params.userid);
  res.writeHead(
    200,
    {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
  );
  res.end();
});

module.exports = router;
