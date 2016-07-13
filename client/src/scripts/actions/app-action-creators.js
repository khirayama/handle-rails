import { dispatch, subscribe } from '../libs/app-dispatcher';
import { actionTypes as types } from '../constants/constants';


export default class AppActionScubscriber {
  constructor() {
    subscribe((event) => {
      switch (event.type) {
        case 'UI_CLICK_SETTINGS_BUTTON_IN_HEADER':
        case 'UI_CLICK_HELP_LINK_IN_SETTINGS_PAGE':
          changePage(event.link);
          break;
        case 'UI_CLICK_PAGE_BACK_BUTTON_IN_PAGE_BACK_BUTTON':
          backPage();
          break;
        default:
          break;
      }
    });
  }
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
