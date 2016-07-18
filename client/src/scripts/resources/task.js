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
}
export default new TaskResource();
