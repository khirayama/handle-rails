import MicroEmitter from 'micro-emitter';


const EVENT_CHANGE = 'CHANGE_STORE';

export default class MicroStore extends MicroEmitter {
  constructor() {
    super();

    this.state = {};
  }

  dispatchChange() {
    this.emit(EVENT_CHANGE);
  }

  addChangeListener(listener) {
    this.addListener(EVENT_CHANGE, listener);
  }

  removeChangeListener(listener) {
    this.removeListener(EVENT_CHANGE, listener);
  }

  register(dispatcher, actionType, callback) {
    dispatcher.addListener(actionType, data => {
      callback(data);
    });
  }

  getState() {
    return Object.assign({}, this.state);
  }
}
