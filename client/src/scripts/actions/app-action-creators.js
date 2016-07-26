import { dispatch, subscribe } from '../libs/app-dispatcher';
import { actionTypes as types } from '../constants/constants';


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
