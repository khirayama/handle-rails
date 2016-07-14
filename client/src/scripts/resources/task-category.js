import superagent from 'superagent';
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
    superagent
    .get('/api/v1/task_categories')
    .end((err, res) => {
      if (res.text) {
        this._data = JSON.parse(res.text);
        this._save();
      }
    });
  }
}
export default new TaskCategoryResource();
