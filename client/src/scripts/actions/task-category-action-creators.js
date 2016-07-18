import request from 'axios';

import { dispatch, subscribe } from '../libs/app-dispatcher';
import Task from '../resources/task';
import TaskCategory from '../resources/task-category';
import { actionTypes as types } from '../constants/constants';
import { validateByJSONSchema } from '../json-schemas/json-schema';
import { TASK_SCHEMA, TASKS_SCHEMA } from '../json-schemas/task';

// Should remove this
import { getTasks } from './task-action-creators';


export default class TaskCategoryActionSubscriber {
  constructor() {
    subscribe((event) => {
      switch (event.type) {
        case 'UI_START_APP':
          getTaskCategories();
          break;
        // component: task-page
        case 'UI_CLICK_ADD_CATEGORY_BUTTON_IN_TASK_PAGE':
          createTaskCategory('');
          break;
        case 'UI_DRAGEND_ON_LIST_IN_TASK_PAGE':
          sortTaskCategories(event.from, event.to);
          break;
        // component: task-list
        case 'UI_CLICK_TITLE_IN_TASK_LIST':
          editTaskCategory(event.id);
          break;
        case 'UI_KEYDOWN_TASK_CATEGORY_INPUT_WITH_ENTER_IN_TASK_LIST':
        case 'UI_KEYDOWN_TASK_CATEGORY_INPUT_WITH_ESC_IN_TASK_LIST':
        case 'UI_BLUR_TASK_CATEGORY_INPUT_IN_TASK_LIST':
          if (event.value !== '') {
            updateTaskCategory(
              event.id,
              event.value
            );
          } else {
            deleteTaskCategory(event.id);
          }
          break;
        case 'UI_CLICK_DELETE_TASK_CATEGORY_BUTTON_IN_TASK_LIST':
          deleteTaskCategory(event.id);
          break;
        default:
          break;
      }
    });
  }
}

function buildTaskCategories(taskCategories, tasks) {
  const taskCategories_ = [];

  for(let taskCategoryIndex = 0; taskCategoryIndex < taskCategories.length; taskCategoryIndex++) {
    const taskCategory = taskCategories[taskCategoryIndex];
    const taskCategory_ = {
      id: taskCategory.id,
      name: taskCategory.name,
      order: taskCategory.order,
      tasks: [],
    };
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
      const task = tasks[taskIndex];
      if (taskCategory.id == task.task_category_id) {
        taskCategory_.tasks.push({
          id: task.id,
          text: task.text,
          completed: task.completed,
          order: task.order,
          taskCategoryId: task.task_category_id,
        });
      }
    }
    taskCategory_.tasks.sort((itemA, itemB) => {
      const valueX = itemA['order'];
      const valueY = itemB['order'];

      if (valueX > valueY) return 1;
      if (valueX < valueY) return -1;
      return 0;
    });
    taskCategories_.push(taskCategory_);
  }
  taskCategories_.sort((itemA, itemB) => {
    const valueX = itemA['order'];
    const valueY = itemB['order'];

    if (valueX > valueY) return 1;
    if (valueX < valueY) return -1;
    return 0;
  });
  return taskCategories_;
}

export function getTaskCategories() {
  TaskCategory.fetch().then((taskCategoryRes) => {
    Task.fetch().then((taskRes) => {
      const taskCategories = buildTaskCategories(taskCategoryRes.data, taskRes.data);

      dispatch({
        type: types.GET_ALL_TASK_CATEGORIES,
        taskCategories,
      });
    });
  });
}

export function editTaskCategory(id) {
  const entity = TaskCategory.find(id).then((res) => {
    const entity = {
      id: res.data.id,
      name: res.data.name,
      order: res.data.order,
      isEditing: true,
    }

    dispatch({
      type: types.EDIT_TASK_CATEGORY,
      taskCategory: entity
    });
  });
}

export function updateTaskCategory(id, name) {
  TaskCategory.update(id, { name }).then((res) => {
    const entity = {
      id: res.data.id,
      name: res.data.name,
      order: res.data.order,
      isEditing: false,
    }

    dispatch({
      type: types.UPDATE_TASK_CATEGORY,
      taskCategory: entity
    });
  });
}

export function createTaskCategory(name) {
  TaskCategory.create({ name }).then((res) => {
    const entity = {
      id: res.data.id,
      name: res.data.name,
      order: res.data.order,
      isEditing: true,
    }

    dispatch({
      type: types.CREATE_TASK_CATEGORY,
      taskCategory: entity
    });
  });
}

export function deleteTaskCategory(id) {
  TaskCategory.destroy(id).then((res) => {
    dispatch({
      type: types.DELETE_TASK_CATEGORY,
      deletedTaskCategoryId: id,
    });
  });
}

export function sortTaskCategories(from, to) {
  TaskCategory.reorder({ from, to }).then((taskCategoryRes) => {
    Task.fetch().then((taskRes) => {
      const taskCategories = buildTaskCategories(taskCategoryRes.data, taskRes.data);
      dispatch({
        type: types.SORT_TASK_CATEGORIES,
        taskCategories,
      });
    });
  });
}
