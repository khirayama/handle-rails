import MicroStore from '../libs/micro-store';

import logger from '../utils/logger';
import { subscribe } from '../libs/app-dispatcher';
import { actionTypes as types } from '../constants/constants';
import { parseTextToItem } from '../utils/text-to-schedule-parser';
import { validateByJSONSchema } from '../json-schemas/json-schema';
import { TASK_STORE_SCHEMA, TASKS_SCHEMA } from '../json-schemas/task-store';


export default class TaskStore extends MicroStore {
  constructor() {
    super();

    this._tasks = [];
    this._taskCategories = [];

    subscribe((action) => {
      switch (action.type) {
        case types.GET_ALL_TASKS:
          this.setTasks(action.tasks);
          this.dispatchChange();
          break;
        case types.CREATE_TASK:
          this.createTask(action.task);
          this.dispatchChange();
          break;
        case types.UPDATE_TASK:
          this.updateTask(action.task);
          this.dispatchChange();
          break;
        case types.GET_ALL_TASK_CATEGORIES:
        case types.SORT_TASK_CATEGORIES:
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
    this._taskCategories = taskCategories;
  }

  getTaskCategories() {
    return this._taskCategories;
  }


  getTasks() {
    return this._tasks;
  }

  setTasks(tasks = []) {
    const newTasks = tasks.splice(0);

    newTasks.forEach(taskCategory => {
      taskCategory.tasks.forEach((task, index) => {
        const newTask = TaskStore._addSchedule(task);

        taskCategory.tasks.splice(index, 1, newTask);
      });
    });

    validateByJSONSchema(newTasks, TASKS_SCHEMA);
    TaskStore._checkOrder(newTasks);
    this._tasks = newTasks;
  }

  createTask(task) {
    const newTask = TaskStore._addSchedule(task);

    this._taskCategories.forEach(taskCategory => {
      if (taskCategory.id === task.taskCategoryId) {
        taskCategory.tasks.push(newTask);
      }
    });
  }

  updateTask(task) {
    const newTask = TaskStore._addSchedule(task);

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

  addTaskCategory(taskCategory) {
    this._taskCategories.push(taskCategory);
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
    for (let taskIndex = 0; taskIndex < this._taskCategories.length; taskIndex++) {
      const taskCategory_ = this._taskCategories[taskIndex];
      if (taskCategory_.id === deletedTaskCategoryId) {
        this._taskCategories.splice(taskIndex, 1);
      }
    }
  }

  static _addSchedule(task) {
    const taskWithSchedule = parseTextToItem(task.text);
    const newTask = Object.assign({}, task, {
      scheduleText: taskWithSchedule.text,
      schedule: taskWithSchedule.schedule,
    });

    return newTask;
  }

  static _checkOrder(tasks) {
    tasks.forEach(taskCategory => {
      taskCategory.tasks.forEach((task, taskIndex) => {
        if (task.order !== taskIndex) {
          logger.error({ error: 'Wrong order.', item: task });
        }
      });
    });
  }
}
