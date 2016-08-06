import request from 'axios';

import ajaxErrorHandler from '../utils/ajax-error-handler';


export class TaskCategoryResource {
  constructor() {
    this.defaults = {
      name: '',
      order: null,
    };
  }
  fetch() {
    return new Promise((resolve) => {
      request.get('/api/v1/task_categories').then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
  find(id) {
    return new Promise((resolve) => {
      request.get(`/api/v1/task_categories/${ id }`).then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
  create(entity) {
    return new Promise((resolve) => {
      request.post('/api/v1/task_categories', entity).then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
  update(id, entity) {
    return new Promise((resolve) => {
      request.put(`/api/v1/task_categories/${ id }`, entity).then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
  destroy(id) {
    return new Promise((resolve) => {
      request.delete(`/api/v1/task_categories/${ id }`).then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
  reorder(orders) {
    return new Promise((resolve) => {
      request.put('/api/v1/task_categories', orders).then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
}
export default new TaskCategoryResource();
