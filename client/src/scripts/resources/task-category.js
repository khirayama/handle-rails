import MicroResource from '../libs/micro-resource';
import { initialTaskCategoryNames } from '../constants/constants';


export class TaskCategoryResource extends MicroResource {
  constructor() {
    super();
    this.defaults = {
      name: '',
      order: null,
    };
    this.init();
  }

  init() {
    const taskCategories = this.all();

    if (!taskCategories.length) {
      this.create({ name: initialTaskCategoryNames.TODAY, order: 0 });
      this.create({ name: initialTaskCategoryNames.LATER, order: 1 });
      this.create({ name: initialTaskCategoryNames.SCHEDULE, order: 2 });
    }
  }
}
export default new TaskCategoryResource();
