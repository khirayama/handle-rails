import MicroEmitter from 'micro-emitter';


const EVENT_CHANGE = 'CHANGE_STORE';

export default class MicroStore extends MicroEmitter {
  dispatchChange() {
    this.emit(EVENT_CHANGE);
  }

  dispatchCustomEvent(type) {
    this.emit(type);
  }

  addChangeListener(listener) {
    this.addListener(EVENT_CHANGE, listener);
  }

  removeChangeListener(listener) {
    this.removeListener(EVENT_CHANGE, listener);
  }

  addCustomEventListener(type, listener) {
    this.addListener(type, listener);
  }

  removeCustomEventListener(type, listener) {
    this.removeListener(type, listener);
  }

  register(dispatcher, actionType, callback) {
    dispatcher.addListener(actionType, data => {
      callback(data);
    });
  }
}
