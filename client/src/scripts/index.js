import React from 'react';
import ReactDOM from 'react-dom';

import logger from './utils/logger';
import EventRouter from './router/event-router';
import AppStore from './stores/app-store';
import App from './components/app';


window.addEventListener('load', () => {
  logger.info(`Start manege app at ${new Date()}`);

  new EventRouter();
  const appStore = new AppStore();
  ReactDOM.render(<App appStore={appStore} />, document.querySelector('#app'));
});
