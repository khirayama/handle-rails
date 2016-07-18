import request from 'axios';


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
      });
    });
  }
  create(entity) {
    return new Promise((resolve) => {
      request.post('/api/v1/tasks', entity).then((res) => {
        resolve(res);
      });
    });
  }
  update(id, entity) {
    return new Promise((resolve) => {
      request.put(`/api/v1/tasks/${ id }`, entity).then((res) => {
        resolve(res);
      });
    });
  }
}
export default new TaskResource();
