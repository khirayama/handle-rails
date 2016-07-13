import MicroResource from '../libs/micro-resource';


export class TaskResource extends MicroResource {
  constructor(options) {
    super(options);
    this.defaults = {
      text: '',
      completed: false,
      categoryId: null,
      order: null,
    };
  }
}
export default new TaskResource();
