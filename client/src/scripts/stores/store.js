import { pages, actionTypes as types } from '../constants/constants';
import { dispatch, subscribe } from '../libs/app-dispatcher';
import MicroStore from '../libs/micro-store';
import TaskState from '../states/task-state';


export default class Store extends MicroStore {
  constructor() {
    super();

    this._homePage = pages.TASKS;
    this._page = this._getStartPage();
    this._history = [];
    this.state = null;

    location.hash = this._page;

    this._routes();
    this._subscribe();

    this.emit(this._page);
  }

  _subscribe() {
    subscribe((action) => {
      switch (action.type) {
        case types.CHANGE_PAGE:
          location.hash = action.page;
          this.emit(action.page);
          this.dispatchChange();
          break;
        case types.BACK_PAGE:
          const page = this._history[this._history.length - 2] || this._homePage;

          location.hash = page;
          this._history.splice(this._history.length - 2, 2);
          this.emit(page);
          this.dispatchChange();
          break;
      }
    });
  }

  _changePage(page) {
    this._history.push(page);
    this._page = page;
  }

  // routing
  _routes() {
    this.on(pages.TASKS, () => {
      if (!(this.state instanceof TaskState)) {
        this.state = new TaskState();
        this.state.addChangeListener(() => {
          this.dispatchChange();
        });
      }
      this._changePage(pages.TASKS);
    });

    this.on(pages.SETTINGS, () => {
      this.state = {
        meta: { title: 'Settings' },
        styles: {
          transition: 'fadeInOut',
          header: { position: 'bottom' },
        }
      };
      this._changePage(pages.SETTINGS);
    });

    this.on(pages.HELP, () => {
      this.state = {
        meta: { title: 'Help' },
        styles: {
          transition: 'slideInOut',
          header: { position: 'bottom' },
        }
      };
      this._changePage(pages.HELP);
    });
  }

  _getStartPage() {
    const page = location.hash.replace('#', '');
    const keys = Object.keys(pages);
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
      const key = keys[keyIndex];
      const page_ = pages[key];
      if (page_ === page) {
        return page_;
      }
    }
    return this._homePage;
  }

  getPage() {
    return this._page;
  }
}
