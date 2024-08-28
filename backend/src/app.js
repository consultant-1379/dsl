/* ============================================================================
 * Ericsson Data Science Lounge Backend
 *
 * app.js - Main code for backend.
 * ============================================================================
 */


// FIXME: A LOT TO RE-FACTOR HERE.
//  - Convert to TS?
//  - Move GIT handling from frontend into backend...
//  - etc. etc. etc.

// External Imports
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import authRouter from './routes/auth';
import fileManagerRouter from './routes/fileManager';
import projectRouter from './routes/project';
import indexRouter from './routes/index';
import logger from './services/logger';

const port = 3000;

require('./config/environment');

// Initialize App
const app = express();

app.use(morgan('combined')); // Enable logging with morgan
app.use(cors()); // Enable CORS.
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/project', passport.authenticate('jwt', { session: false }), projectRouter);
app.use('/fileManager', passport.authenticate('jwt', { session: false }), fileManagerRouter);

// Listen on port 3000
app.listen(port, () => { // TODO - Extract port as configuration paramater.
  logger.log('info', 'Server running on port %d', port);
});
