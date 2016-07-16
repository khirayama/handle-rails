import request from 'axios';
import MicroResource from '../libs/micro-resource';
import { initialTaskCategoryNames } from '../constants/constants';


export class TaskCategoryResource extends MicroResource {
  constructor() {
    super();
    this.defaults = {
      name: '',
      order: null,
    };
    this.initialize();
  }
  initialize() {
    request.get('/api/v1/task_categories').then((res) => {
      console.log(res.data);
      if (res.data) {
        this._data = res.data;
        this._save();
      }
    });
  }
}
export default new TaskCategoryResource();
