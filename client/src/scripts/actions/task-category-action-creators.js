import request from 'axios';

import { dispatch, subscribe } from '../libs/app-dispatcher';
import Task from '../resources/task';
import TaskCategory from '../resources/task-category';
import { actionTypes as types } from '../constants/constants';
import { validateByJSONSchema } from '../json-schemas/json-schema';
import { TASK_SCHEMA, TASKS_SCHEMA } from '../json-schemas/task';
import { buildTaskCategories } from './action-helpers';


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
      tasks: [],
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

export function sortTaskCategories(id, order) {
  TaskCategory.reorder({ id, order }).then((taskCategoryRes) => {
    Task.fetch().then((taskRes) => {
      const taskCategories = buildTaskCategories(taskCategoryRes.data, taskRes.data);
      dispatch({
        type: types.SORT_TASK_CATEGORIES,
        taskCategories,
      });
    });
  });
}
