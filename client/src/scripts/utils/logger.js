/* eslint "no-console": 0 */

import config from '../../config';

const logLevels = {
  DEBUG: 0,
  INFO: 0,
  TRACE: 1,
  WARN: 2,
  ERROR: 3,
};

const logger = {
  debug: (...args) => {
    if (config.logLevels.indexOf(logLevels.DEBUG) === -1) return;
    console.log(...args);
  },
  info: (...args) => {
    if (config.logLevels.indexOf(logLevels.INFO) === -1) return;
    console.log(...args);
  },
  trace: (...args) => {
    if (config.logLevels.indexOf(logLevels.TRACE) === -1) return;
    console.trace(...args);
  },
  warn: (...args) => {
    if (config.logLevels.indexOf(logLevels.WARN) === -1) return;
    console.warn(...args);
  },
  error: (...args) => {
    if (config.logLevels.indexOf(logLevels.ERROR) === -1) return;
    console.error(...args);
  },
};

export default logger;
