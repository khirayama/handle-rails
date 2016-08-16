import { pages, actionTypes as types } from '../constants/constants';
import { dispatch, subscribe } from '../libs/app-dispatcher';
import MicroStore from '../libs/micro-store';
import TaskCategoriesPageStore from '../stores/task-categories-page-store';


const UPDATE_PAGE = '__UPDATE_PAGE';

export default class AppStore extends MicroStore {
  constructor() {
    super();

    this.state = {};
    // application state
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

    // task-categories-page state
    this.state.taskCategories = [];

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
          this.state.currentUserInformation = null;
          this._updatePage(action.pathname);
          this.dispatchChange();
          break;
        case types.GET_CURRENT_USER_INFORMATION:
          this.state.currentUserInformation = action.currentUserInformation;
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
            this.state.taskCategories = pageStore._taskCategories;
            pageStore.addChangeListener(() => {
              this.state.taskCategories = pageStore._taskCategories;
              this.dispatchChange();
            });
            this.state.pageInformation = Object.assign({}, this.state.pageInformation, {
              name: pages.TASK_CATEGORIES,
              meta: { title: 'Task Categories' },
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
            this.state.pageInformation = Object.assign({}, this.state.pageInformation, {
              name: pages.LANDING,
              meta: { title: 'Welcome to Handle' },
              styles: {
                transition: 'fadeInOut',
                header: { position: 'none' },
              }
            });
            this.dispatchChange();
          }
          break;
        case '/help':
          this.state.pageInformation = Object.assign({}, this.state.pageInformation, {
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
          this.state.pageInformation = Object.assign({}, this.state.pageInformation, {
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
          this.state.pageInformation = Object.assign({}, this.state.pageInformation, {
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

  getState() {
    return Object.assign({}, this.state);
  }

  // helpers
  _isLoggedIn() {
    return (this.state.currentUserInformation != null);
  }
}
