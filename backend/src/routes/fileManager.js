/* ============================================================================
 * Ericsson Data Science Lounge Backend
 *
 * fileManager.js - Handles any file system operations needed by the backend.
 * ============================================================================
 */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import FileHandler from '../services/FileHandler';
import logger from '../services/logger';

const router = express.Router();

const TEMP_LOCATION = 'tmp'; // FIXME: Extract constant

// TODO: think about security implication of this class.

/*
 * List files in a directory specific extensions.
 */
router.get('/ls/:userid/:uniqueid', (req, res) => {
  // List of allowed extensions
  // TODO: extract as configuration parameter
  const ALLOWED_EXTENSIONS = ['.ipynb'];

  const userId = req.params.userid;
  const uniqueId = req.params.uniqueid;
  const pathToProject = path.join('.', TEMP_LOCATION, userId, uniqueId);

  FileHandler.findProjectFiles(pathToProject, ALLOWED_EXTENSIONS)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      logger.log('error', `There was error while trying to find the project files: ${error}`);
      res.status(500);
      res.send('There was an error retrieving the files');
    });
});

/*
 * Creates an upload directory for a user.
 */
router.post('/mkdir', bodyParser.json(), (req, res) => {
  const json = req.body;
  const userPath = path.join(json.username, json.uniqueid);
  logger.log('info', 'Creating user directory.');
  FileHandler.createUserDirectory(userPath);
  res.writeHead(
    200,
    {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
  );
  res.end();
});

/*
 * Empties an upload directory for specified user.
 */
router.delete('/rm/:userid/:uniqueid', (req, res) => {
  const userId = req.params.userid;
  const uniqueId = req.params.uniqueid;
  FileHandler.cleanUnique(userId, uniqueId);
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
