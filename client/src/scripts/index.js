import React from 'react';
import ReactDOM from 'react-dom';

import logger from './utils/logger';
import EventRouter from './router/event-router';
import Store from './stores/store';
import Container from './containers/container';


window.addEventListener('load', () => {
  logger.info(`Start manege app at ${new Date()}`);

  new EventRouter();
  const store = new Store();
  ReactDOM.render(<Container store={store} />, document.querySelector('#app'));
});
