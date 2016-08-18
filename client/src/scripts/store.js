import { pages, actionTypes as types } from './constants/constants';
import { dispatch, subscribe } from './libs/app-dispatcher';
import MicroStore from './libs/micro-store';

// reducers
import pageInformation from './reducers/page-information';
import currentUserInformation from './reducers/current-user-information';
import taskCategories from './reducers/task-categories';


export default class AppStore extends MicroStore {
  constructor() {
    super();

    this.state.pageInformation = {
      name: null,
      meta: { title: null },
      styles: {
        transition: null,
        header: {
          position: 'none',
          href: '/',
        }
      }
    };
    this.state.currentUserInformation = null;
    this.state.taskCategories = [];

    this._subscribe();
  }

  _subscribe() {
    subscribe((action) => {
      // redirect case
      switch (action.type) {
        case types.FAIL_AUTHENTICATE:
        case types.GET_CURRENT_USER_INFORMATION:
        case types.CHANGE_HISTORY:
          dispatch({
            type: types.UPDATE_PAGE,
            pathname: action.pathname,
            currentUserInformation: this.state.currentUserInformation,
          });
          break;
      }

      this.state.pageInformation = pageInformation(this.state.pageInformation, action);
      this.state.currentUserInformation = currentUserInformation(this.state.currentUserInformation, action);
      this.state.taskCategories = taskCategories(this.state.taskCategories, action);

      this.dispatchChange();
    });
  }
}
