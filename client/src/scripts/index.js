import React from 'react';
import ReactDOM from 'react-dom';

import logger from './utils/logger';
import { isMobileUI } from './utils/is-mobile-ui';
import EventRouter from './router/event-router';
import AppStore from './stores/app-store';
import App from './components/app';
import MobileApp from './components/mobile/app';

function loadStyle(filePath) {
  const link = document.createElement('link');
  const head = document.querySelector('head');

  link.rel = 'stylesheet';
  link.href = filePath;

  head.appendChild(link);
}

window.addEventListener('load', () => {
  logger.info(`Start manege app at ${new Date()}`);

  new EventRouter();
  const appStore = new AppStore();
  if (isMobileUI()) {
    loadStyle('mobile/index.css');
    ReactDOM.render(<MobileApp appStore={appStore} />, document.querySelector('#app'));
  } else {
    loadStyle('index.css');
    ReactDOM.render(<App appStore={appStore} />, document.querySelector('#app'));
  }
});
