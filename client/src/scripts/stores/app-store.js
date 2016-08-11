import { pages, actionTypes as types } from '../constants/constants';
import { dispatch, subscribe } from '../libs/app-dispatcher';
import MicroStore from '../libs/micro-store';
import TaskCategoriesPageStore from '../stores/task-categories-page-store';

const UPDATE_PAGE = 'UPDATE_PAGE';

export default class AppStore extends MicroStore {
  constructor() {
    super();

    // application state
    this._page = null;;
    this._currentUserInformation = null;

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
          this._updatePage();
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
          if (this.isLoggedIn()) {
            this._page = pages.TASK_CATEGORIES;
            if (!(this.pageStore instanceof TaskCategoriesPageStore)) {
              this.pageStore = new TaskCategoriesPageStore();
              this.pageStore.addChangeListener(() => {
                this.dispatchChange();
              });
            }
          } else {
            this._page = pages.LANDING;
            this.pageStore = {
              meta: { title: 'Landing' },
              styles: {
                transition: 'fadeInOut',
                header: { position: 'none' },
              }
            };
            this.dispatchChange();
          }
          break;
        case '/help':
          this._page = pages.HELP;
          this.pageStore = {
            meta: { title: 'Help' },
            styles: {
              transition: 'slideInOut',
              header: { position: 'bottom' },
            }
          };
          this.dispatchChange();
          break;
        case '/settings':
          this._page = pages.SETTINGS;
          this.pageStore = {
            meta: { title: 'Settings' },
            styles: {
              transition: 'fadeInOut',
              header: { position: 'bottom' },
            }
          };
          this.dispatchChange();
          break;
        default:
          this._page = pages.NOT_FOUND;
          this.pageStore = {
            meta: { title: '404' },
            styles: {
              transition: 'fadeInOut',
              header: { position: 'bottom' },
            }
          };
          break;
      }
    });
  }

  getPage() {
    return this._page;
  }

  isLoggedIn() {
    return (this._currentUserInformation != null);
  }
}
