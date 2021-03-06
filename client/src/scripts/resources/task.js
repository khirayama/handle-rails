import request from 'axios';

import ajaxErrorHandler from '../utils/ajax-error-handler';


export class TaskResource {
  constructor(options) {
    this.defaults = {
      text: '',
      completed: false,
      categoryId: null,
      order: null,
    };
    this._data = [];
  }
  fetch() {
    return new Promise((resolve) => {
      request.get('/api/v1/tasks').then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
  create(entity) {
    return new Promise((resolve) => {
      request.post('/api/v1/tasks', entity).then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
  update(id, entity) {
    return new Promise((resolve) => {
      request.put(`/api/v1/tasks/${ id }`, entity).then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
  destroy(id) {
    return new Promise((resolve) => {
      request.delete(`/api/v1/tasks/${ id }`).then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
  find(id) {
    return new Promise((resolve) => {
      request.get(`/api/v1/tasks/${ id }`).then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
  reorder(orders) {
    return new Promise((resolve) => {
      request.put('/api/v1/tasks', orders).then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
  move(orders) {
    return new Promise((resolve) => {
      request.put('/api/v1/move_tasks', orders).then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
}
export default new TaskResource();
