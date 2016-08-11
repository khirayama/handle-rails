import { dispatch, subscribe } from '../libs/app-dispatcher';
import { actionTypes as types } from '../constants/constants';
import CurrentUserInformation from '../resources/current-user-information';


export function getCurrentUserInformation() {
  CurrentUserInformation.fetch().then((res) => {
    dispatch({
      types: types.GET_CURRENT_USER_INFORMATION,
      currentUserInformation: res.data
    });
  });
}

export function changePage(page) {
  dispatch({
    type: types.CHANGE_PAGE,
    page: page,
  });
}

export function backPage() {
  dispatch({
    type: types.BACK_PAGE,
  });
}
