import logger from '../services/logger';

// Load Environment
const environment = process.env.NODE_ENV || 'dev';
const envFile = `./${environment}.env`;
logger.log('info', `RestApi running in ${environment}. Loading configuration from ${envFile}`);
require('dotenv').config({ path: envFile });
