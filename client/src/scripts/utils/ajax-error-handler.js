import { dispatch, subscribe } from '../libs/app-dispatcher';
import { actionTypes as types } from '../constants/constants';


export default function ajaxErrorHandler(error) {
  // TODO: route action by error code
  // Suppose auth error
  dispatch({
    type: types.FAIL_AUTHENTICATE,
  });
}
