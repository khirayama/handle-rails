import React from 'react';
import ReactDOM from 'react-dom';

import logger from './utils/logger';
import AppStore from './stores/app-store';
import App from './containers/app';
import EventRouter from './router/event-router';
import { dispatch } from './libs/app-dispatcher';


window.addEventListener('load', () => {
  new EventRouter();

  dispatch({ type: 'UI_START_APP' });

  logger.info(`Start manege app at ${new Date()}`);


  const appStore = new AppStore();

  ReactDOM.render(<App appStore={appStore} />, document.querySelector('#app'));
});
