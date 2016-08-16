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

        case types.CREATE_TASK:
          this.createTask(action.task);
          this.dispatchChange();
          break;
        case types.UPDATE_TASKS:
          this.updateTasks(action.tasks);
          this.dispatchChange();
          break;
        case types.UPDATE_TASK:
          this.updateTask(action.task);
          this.dispatchChange();
          break;
        case types.DELETE_TASK:
          this.deleteTask(action.deletedTaskId);
          this.dispatchChange();
          break;
        case types.GET_ALL_TASK_CATEGORIES:
        case types.SORT_TASK_CATEGORIES:
        case types.SORT_TASKS:
          this.setTaskCategories(action.taskCategories);
          this.dispatchChange();
          break;
        case types.CREATE_TASK_CATEGORY:
          this.addTaskCategory(action.taskCategory);
          this.dispatchChange();
          break;
        case types.EDIT_TASK_CATEGORY:
          this.updateTaskCategory(action.taskCategory);
          this.dispatchChange();
          break;
        case types.UPDATE_TASK_CATEGORY:
          this.updateTaskCategory(action.taskCategory);
          this.dispatchChange();
          break;
        case types.DELETE_TASK_CATEGORY:
          this.deleteTaskCategory(action.deletedTaskCategoryId);
          this.dispatchChange();
          break;
        default:
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

  // reducers
  setTaskCategories(taskCategories) {
    this.state.taskCategories = taskCategories.map((taskCategory) => {
      taskCategory.tasks = taskCategory.tasks.map((task) => {
        return _addSchedule(task);
      });
      return Object.assign({}, taskCategory);
    });
  }

  getTaskCategories() {
    return this.state.taskCategories;
  }

  createTask(task) {
    const newTask = _addSchedule(task);

    this.state.taskCategories.forEach(taskCategory => {
      if (taskCategory.id === task.taskCategoryId) {
        taskCategory.tasks.push(newTask);
      }
    });
  }

  updateTask(task) {
    const newTask = _addSchedule(task);

    this.state.taskCategories.forEach(taskCategory => {
      if (taskCategory.id === task.taskCategoryId) {
        taskCategory.tasks.forEach((task_, index) => {
          if (task_.id === task.id) {
            taskCategory.tasks.splice(index, 1, newTask);
          }
        });
      }
    });
  }

  updateTasks(tasks) {
    tasks.forEach((task) => {
      this.updateTask(task);
    });
  }

  deleteTask(deletedTaskId) {
    for (let taskCategoryIndex = 0; taskCategoryIndex < this.state.taskCategories.length; taskCategoryIndex++) {
      const taskCategory = this.state.taskCategories[taskCategoryIndex];
      for (let taskIndex = 0; taskIndex < taskCategory.tasks.length; taskIndex++) {
        const task = taskCategory.tasks[taskIndex];
        if (task.id === deletedTaskId) {
          taskCategory.tasks.splice(taskIndex, 1);
        }
      }
    }
  }

  addTaskCategory(taskCategory) {
    this.state.taskCategories.push(Object.assign({}, taskCategory));
  }

  updateTaskCategory(taskCategory) {
    for (let taskIndex = 0; taskIndex < this.state.taskCategories.length; taskIndex++) {
      const taskCategory_ = this.state.taskCategories[taskIndex];
      if (taskCategory_.id === taskCategory.id) {
        taskCategory_.id = taskCategory.id;
        taskCategory_.name = taskCategory.name;
        taskCategory_.isEditing = taskCategory.isEditing;
      }
    }
  }

  deleteTaskCategory(deletedTaskCategoryId) {
    for (let taskCategoryIndex = 0; taskCategoryIndex < this.state.taskCategories.length; taskCategoryIndex++) {
      const taskCategory = this.state.taskCategories[taskCategoryIndex];
      if (taskCategory.id === deletedTaskCategoryId) {
        this.state.taskCategories.splice(taskCategoryIndex, 1);
      }
    }
    // make order sequence
    this.state.taskCategories.forEach((taskCategory, index) => {
      taskCategory.order = index;
    });
  }
}
