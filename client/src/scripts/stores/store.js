import { pages, actionTypes as types } from '../constants/constants';
import { subscribe } from '../libs/app-dispatcher';
import MicroStore from '../libs/micro-store';
import TaskState from '../states/task-state';


export default class Store extends MicroStore {
  constructor() {
    super();

    this._homePage = pages.TASKS;
    this._page = this._getStartPage();
    this._title = '';
    this._history = [];

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
      this.createTasksPage();
    });

    this.on(pages.SETTINGS, () => {
      this.createSettingsPage();
    });

    this.on(pages.HELP, () => {
      this.createHelpPage();
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

  getTitle() {
    return this._title;
  }

  // create page element methods
  createTasksPage() {
    this._title = 'Task';

    this._changePage(pages.TASKS);
    if (!this.taskState) {
      this.taskState = new TaskState();
      this.taskState.addChangeListener(() => {
        this.dispatchChange();
      });
    }
  }

  createSettingsPage() {
    this._title = 'Settings';

    this._changePage(pages.SETTINGS);
  }

  createHelpPage() {
    this._title = 'Help';

    this._changePage(pages.HELP);
  }
}
