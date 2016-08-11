import config from '../../config';
import { pages, actionTypes as types } from '../constants/constants';
import { dispatch, subscribe } from '../libs/app-dispatcher';
import MicroStore from '../libs/micro-store';
import TaskCategoriesPageStore from '../stores/task-categories-page-store';

const UPDATE_PAGE = 'UPDATE_PAGE';

export default class AppStore extends MicroStore {
  constructor() {
    super();

    // application state
    this._page = null;
    this._pageInformation = {
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
    this._currentUserInformation = null;

    // task-categories-page state
    this._taskCategories = [];

    this._routes();
    this._subscribe();
  }

  _updatePage(pathname) {
    this.emit(UPDATE_PAGE, pathname);
  }

  _subscribe() {
    subscribe((action) => {
      switch (action.type) {
        case types.FAIL_AUTHENTICATE:
          this._currentUserInformation = null;
          this._updatePage(action.pathname);
          this.dispatchChange();
          break;
        case types.GET_CURRENT_USER_INFORMATION:
          this._currentUserInformation = action.currentUserInformation;
          this._updatePage(action.pathname);
          this.dispatchChange();
          break;
        case types.CHANGE_HISTORY:
          this._updatePage(action.pathname);
          this.dispatchChange();
          break;
      }
    });
  }

  // routing
  _routes() {
    this.on(UPDATE_PAGE, (pathname) => {
      switch (pathname) {
        case '/':
          if (this._isLoggedIn()) {
            const pageStore = new TaskCategoriesPageStore();
            this._taskCategories = pageStore._taskCategories;
            pageStore.addChangeListener(() => {
              this._taskCategories = pageStore._taskCategories;
              this.dispatchChange();
            });
            this._pageInformation = Object.assign({}, this._pageInformation, {
              name: pages.TASK_CATEGORIES,
              meta: { title: config.name },
              styles: {
                transition: 'slideUpDown',
                header: {
                  position: 'default',
                  href: '/settings'
                },
              }
            });
            this.dispatchChange();
          } else {
            this._pageInformation = Object.assign({}, this._pageInformation, {
              name: pages.LANDING,
              meta: { title: 'Landing' },
              styles: {
                transition: 'fadeInOut',
                header: { position: 'none' },
              }
            });
            this.dispatchChange();
          }
          break;
        case '/help':
          this._pageInformation = Object.assign({}, this._pageInformation, {
            name: pages.HELP,
            meta: { title: 'Help' },
            styles: {
              transition: 'slideInOut',
              header: { position: 'bottom' },
            }
          });
          this.dispatchChange();
          break;
        case '/settings':
          this._pageInformation = Object.assign({}, this._pageInformation, {
            name: pages.SETTINGS,
            meta: { title: 'Settings' },
            styles: {
              transition: 'fadeInOut',
              header: { position: 'bottom' },
            }
          });
          this.dispatchChange();
          break;
        default:
          this._pageInformation = Object.assign({}, this._pageInformation, {
            name: pages.NOT_FOUND,
            meta: { title: 'NOT FOUND' },
            styles: {
              header: { position: 'none' },
            }
          });
          this.dispatchChange();
          break;
      }
    });
  }

  getPageInformation() {
    return this._pageInformation;
  }

  getState() {
    return {
      isLoggedIn: this._isLoggedIn(),
      currentUserInformation: this._currentUserInformation,

      taskCategories: this._taskCategories,
    }
  }

  _isLoggedIn() {
    return (this._currentUserInformation != null);
  }
}
