import { dispatch, subscribe } from '../libs/app-dispatcher';
import { actionTypes as types } from '../constants/constants';
import CurrentUserInformation from '../resources/current-user-information';


export function getCurrentUserInformation(pathname) {
  CurrentUserInformation.fetch().then((res) => {
    dispatch({
      type: types.GET_CURRENT_USER_INFORMATION,
      currentUserInformation: res.data,
      pathname,
    });
  });
}

export function changeHistory(pathname) {
  dispatch({
    type: types.CHANGE_HISTORY,
    pathname: pathname,
  });
}
