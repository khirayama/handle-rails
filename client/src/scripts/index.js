import React from 'react';
import ReactDOM from 'react-dom';

import logger from './utils/logger';
import { isMobileUI } from './utils/is-mobile-ui';
import { dispatch } from './libs/app-dispatcher';
import EventRouter from './router/event-router';
import Store from './store';

import App from './components/desktop/app';
import MobileApp from './components/mobile/app';


function loadStyle(filePath) {
  const link = document.createElement('link');
  const head = document.querySelector('head');

  link.rel = 'stylesheet';
  link.href = filePath;

  head.appendChild(link);
}

window.addEventListener('popstate', (event) => {
  dispatch({
    type: 'UI_CHANGE_HISTORY',
    pathname: location.pathname
  });
});

window.addEventListener('load', () => {
  logger.info(`Start manege app at ${new Date()}`);

  new EventRouter();
  const store = new Store();
  if (isMobileUI()) {
    loadStyle('mobile/index.css');
    ReactDOM.render(<MobileApp store={store} />, document.querySelector('#app'));
  } else {
    loadStyle('desktop/index.css');
    ReactDOM.render(<App store={store} />, document.querySelector('#app'));
  }
});
