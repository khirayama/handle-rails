import MicroStore from '../libs/micro-store';

import { subscribe } from '../libs/app-dispatcher';
import { pages, actionTypes as types } from '../constants/constants';
import { parseTextToItem } from '../utils/text-to-schedule-parser';

function _addSchedule(task) {
  const taskWithSchedule = parseTextToItem(task.text);
  const newTask = Object.assign({}, task, {
    scheduleText: taskWithSchedule.text,
    schedule: taskWithSchedule.schedule,
  });

  return newTask;
}


export default class TaskCategoriesPageStore extends MicroStore {
  constructor() {
    super();
    this._taskCategories = [];
    this._subscribe();
  }

  _subscribe() {
    subscribe((action) => {
      switch (action.type) {
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

  setTaskCategories(taskCategories) {
    this._taskCategories = taskCategories.map((taskCategory) => {
      taskCategory.tasks = taskCategory.tasks.map((task) => {
        return _addSchedule(task);
      });
      return Object.assign({}, taskCategory);
    });
  }

  getTaskCategories() {
    return this._taskCategories;
  }

  createTask(task) {
    const newTask = _addSchedule(task);

    this._taskCategories.forEach(taskCategory => {
      if (taskCategory.id === task.taskCategoryId) {
        taskCategory.tasks.push(newTask);
      }
    });
  }

  updateTask(task) {
    const newTask = _addSchedule(task);

    this._taskCategories.forEach(taskCategory => {
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
    for (let taskCategoryIndex = 0; taskCategoryIndex < this._taskCategories.length; taskCategoryIndex++) {
      const taskCategory = this._taskCategories[taskCategoryIndex];
      for (let taskIndex = 0; taskIndex < taskCategory.tasks.length; taskIndex++) {
        const task = taskCategory.tasks[taskIndex];
        if (task.id === deletedTaskId) {
          taskCategory.tasks.splice(taskIndex, 1);
        }
      }
    }
  }

  addTaskCategory(taskCategory) {
    this._taskCategories.push(Object.assign({}, taskCategory));
  }

  updateTaskCategory(taskCategory) {
    for (let taskIndex = 0; taskIndex < this._taskCategories.length; taskIndex++) {
      const taskCategory_ = this._taskCategories[taskIndex];
      if (taskCategory_.id === taskCategory.id) {
        taskCategory_.id = taskCategory.id;
        taskCategory_.name = taskCategory.name;
        taskCategory_.isEditing = taskCategory.isEditing;
      }
    }
  }

  deleteTaskCategory(deletedTaskCategoryId) {
    for (let taskCategoryIndex = 0; taskCategoryIndex < this._taskCategories.length; taskCategoryIndex++) {
      const taskCategory = this._taskCategories[taskCategoryIndex];
      if (taskCategory.id === deletedTaskCategoryId) {
        this._taskCategories.splice(taskCategoryIndex, 1);
      }
    }
    // make order sequence
    this._taskCategories.forEach((taskCategory, index) => {
      taskCategory.order = index;
    });
  }
}
