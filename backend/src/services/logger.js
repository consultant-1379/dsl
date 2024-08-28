import { createLogger, format, transports } from 'winston';
import path from 'path';

const {
  combine,
  timestamp,
  label,
  printf,
} = format;

const dslFormat = printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);
const options = {
  file: {
    filename: path.join(__dirname, 'logs', 'backend.log'),
  },
  console: {

  },
};

const logger = createLogger({
  level: 'silly', // Log everything!
  format: combine(
    label({ label: 'dsl-backend' }),
    timestamp(),
    format.splat(),
    format.simple(),
    dslFormat,
  ),
  transports: [
    new transports.Console(options.console),
    new transports.File(options.file),
  ],
});

module.exports = logger;
