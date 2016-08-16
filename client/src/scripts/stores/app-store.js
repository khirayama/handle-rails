import { pages, actionTypes as types } from '../constants/constants';
import { dispatch, subscribe } from '../libs/app-dispatcher';
import MicroStore from '../libs/micro-store';
import { parseTextToItem } from '../utils/text-to-schedule-parser';


function _addSchedule(task) {
  const taskWithSchedule = parseTextToItem(task.text);
  const newTask = Object.assign({}, task, {
    scheduleText: taskWithSchedule.text,
    schedule: taskWithSchedule.schedule,
  });

  return newTask;
}

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
      this.state.taskCategories = taskCategories(this.state.taskCategories, action);
      this.dispatchChange();
    });
  }

  // routing
  _routes() {
    this.on(UPDATE_PAGE, (pathname) => {
      switch (pathname) {
        case '/':
          if (this._isLoggedIn()) {
            this.state.pageInformation = this.updatePageInformation(this.state.pageInformation, {
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
            this.state.pageInformation = this.updatePageInformation(this.state.pageInformation, {
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
          this.state.pageInformation = this.updatePageInformation(this.state.pageInformation, {
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
          this.state.pageInformation = this.updatePageInformation(this.state.pageInformation, {
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
          this.state.pageInformation = this.updatePageInformation(this.state.pageInformation, {
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

  // reducers
  // reducers for pageInformation -- it's a special case
  updatePageInformation(state, action) {
    return Object.assign({}, state, action);
  }
  // helpers
  _isLoggedIn() {
    return (this.state.currentUserInformation != null);
  }
}

function taskCategories(state, action) {

  function createTaskCategory(taskCategories, taskCategory) {
    return [...taskCategories, (Object.assign({}, taskCategory))];
  }

  function setTaskCategories(taskCategories) {
    return taskCategories.map((taskCategory) => {
      taskCategory.tasks = taskCategory.tasks.map((task) => {
        return _addSchedule(task);
      });
      return Object.assign({}, taskCategory);
    });
  }

  function updateTaskCategory(taskCategories, taskCategory) {
    return taskCategories.map((taskCategory_) => {
      if (taskCategory.id === taskCategory_.id) {
        return Object.assign({}, taskCategory_, taskCategory);
      }
      return Object.assign({}, taskCategory_);
    });
  }

  function deleteTaskCategory(taskCategories, deletedTaskCategoryId) {
    return taskCategories.map((taskCategory) => {
      if (taskCategory.id !== deletedTaskCategoryId) {
        return Object.assign({}, taskCategory);
      }
    }).filter(taskCategory => Boolean(taskCategory)).map((taskCategory, index) => {
      // make order sequence
      taskCategory.order = index;
      return Object.assign({}, taskCategory);
    });
  }

  function createTask(taskCategories, task) {
    const newTask = _addSchedule(task);

    return taskCategories.map(taskCategory => {
      if (taskCategory.id === task.taskCategoryId) {
        taskCategory.tasks = [...taskCategory.tasks, newTask];
      }
      return Object.assign({}, taskCategory);
    });
  }

  function updateTask(taskCategories, task) {
    const newTask = _addSchedule(task);

    return taskCategories.map(taskCategory => {
      if (taskCategory.id === task.taskCategoryId) {
        taskCategory.tasks = taskCategory.tasks.map((task_) => {
          if (task_.id === task.id) {
            return Object.assign({}, task_, task);
          }
          return Object.assign({}, task_);
        });
      }
      return Object.assign({}, taskCategory);
    });
  }

  function updateTasks(taskCategories, tasks) {
    return taskCategories.map(taskCategory => {
      if (taskCategory.id === task.taskCategoryId) {
        taskCategory.tasks = taskCategory.tasks.map((task_) => {
          for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
            const task = tasks[taskIndex];
            const newTask = _addSchedule(task);
            if (task_.id === newTask.id) {
              return Object.assign({}, task_, task);
            }
          }
          return Object.assign({}, task_);
        });
      }
      return Object.assign({}, taskCategory);
    });
  }

  function deleteTask(taskCategories, deletedTaskId) {
    return taskCategories.map((taskCategory) => {
      taskCategory.tasks = taskCategory.tasks.map((task) => {
        if (task.id !== deletedTaskId) {
          return Object.assign({}, task);
        }
      }).filter(task => Boolean(task));
      return Object.assign({}, taskCategory);
    });
  }


  switch (action.type) {
    case types.CREATE_TASK_CATEGORY:
      return createTaskCategory(state, action.taskCategory);
    case types.GET_ALL_TASK_CATEGORIES:
    case types.SORT_TASK_CATEGORIES:
    case types.SORT_TASKS:
      return setTaskCategories(action.taskCategories);
    case types.EDIT_TASK_CATEGORY:
    case types.UPDATE_TASK_CATEGORY:
      return updateTaskCategory(state, action.taskCategory);
    case types.DELETE_TASK_CATEGORY:
      return deleteTaskCategory(state, action.deletedTaskCategoryId);

    case types.CREATE_TASK:
      return createTask(state, action.task);
    case types.UPDATE_TASK:
      return updateTask(state, action.task);
    case types.UPDATE_TASKS:
      return updateTasks(state, action.tasks);
    case types.DELETE_TASK:
      return deleteTask(state, action.deletedTaskId);
    default:
      return state;
  }
}
