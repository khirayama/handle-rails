import React from 'react';
import ReactDOM from 'react-dom';

import logger from './utils/logger';
import AppStore from './stores/app-store';
import App from './containers/app';
import AppActionSubscriber from './actions/app-action-creators';
import TaskActionSubscriber from './actions/task-action-creators';
import TaskCategoryActionSubscriber from './actions/task-category-action-creators';
import { dispatch } from './libs/app-dispatcher';


window.addEventListener('load', () => {
  // TODO: start these when subscribe 'UI_START_APP'
  new AppActionSubscriber();
  new TaskActionSubscriber();
  new TaskCategoryActionSubscriber();

  dispatch({ type: 'UI_START_APP' });

  logger.info(`Start manege app at ${new Date()}`);


  const appStore = new AppStore();

  ReactDOM.render(<App appStore={appStore} />, document.querySelector('#app'));
});
