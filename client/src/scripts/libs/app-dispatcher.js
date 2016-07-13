import MicoEmitter from 'micro-emitter';

const appDispatcher = new MicoEmitter();
const ACTION_DISPATCH = '_ACTION_DISPATCH';

export function dispatch(action) {
  appDispatcher.emit(ACTION_DISPATCH, action);
}

export function subscribe(callback) {
  appDispatcher.addListener(ACTION_DISPATCH, callback);
}

export function unsubscribeAll(callback) {
  appDispatcher._listeners = {};
}

export default new MicoEmitter();
