import { dispatch, subscribe } from '../libs/app-dispatcher';
import Task from '../resources/task';
import TaskCategory from '../resources/task-category';
import { actionTypes as types } from '../constants/constants';
import { buildTaskCategories } from './helpers/build-task-categories';


export function createTask(text, taskCategoryId) {
  Task.create({ text, task_category_id: taskCategoryId }).then((res) => {
    const entity = {
      id: res.data.id,
      text: res.data.text,
      completed: res.data.completed,
      taskCategoryId: res.data.task_category_id,
      order: res.data.order,
      isEditing: true,
    };
    dispatch({
      type: types.CREATE_TASK,
      task: entity
    });
  });
}

export function completeTask(id) {
  Task.find(id).then((res_) => {
    Task.update(id, { completed: !res_.data.completed }).then((res) => {
      const entity = {
        id: res.data.id,
        text: res.data.text,
        completed: res.data.completed,
        taskCategoryId: res.data.task_category_id,
        order: res.data.order,
        isEditing: false,
      };
      dispatch({
        type: types.UPDATE_TASK,
        task: entity
      });
    });
  });
}

export function editTask(id) {
  Task.find(id).then((res) => {
    const entity = {
      id: res.data.id,
      text: res.data.text,
      completed: res.data.completed,
      taskCategoryId: res.data.task_category_id,
      order: res.data.order,
      isEditing: true,
    };
    dispatch({
      type: types.UPDATE_TASK,
      task: entity
    });
  });
}

export function editNextTask(categoryId, currentOrder) {
  const entity = Task.where({ categoryId }).where({ order: currentOrder + 1 }).first();
  if (entity === null) {
    return;
  }

  entity.isEditing = true;

  dispatch({
    type: types.UPDATE_TASK,
    task: entity
  });
}

export function editPrevTask(categoryId, currentOrder) {
  const entity = Task.where({ categoryId }).where({ order: currentOrder - 1 }).first();
  if (entity === null) {
    return;
  }

  entity.isEditing = true;

  dispatch({
    type: types.UPDATE_TASK,
    task: entity
  });
}

export function updateTask(id, text) {
  Task.update(id, { text }).then((res) => {
    const entity = {
      id: res.data.id,
      text: res.data.text,
      completed: res.data.completed,
      taskCategoryId: res.data.task_category_id,
      order: res.data.order,
      isEditing: false,
    };
    dispatch({
      type: types.UPDATE_TASK,
      task: entity
    });
  });
}

export function deleteTask(id) {
  Task.destroy(id).then((res) => {
    dispatch({
      type: types.DELETE_TASK,
      deletedTaskId: id,
    });
  });
}

export function sortTasks(id, taskCategoryId, order) {
  Task.reorder({
    id,
    task_category_id: taskCategoryId,
    order
  }).then((taskRes) => {
    TaskCategory.fetch().then((taskCategoryRes) => {
      const taskCategories = buildTaskCategories(taskCategoryRes.data, taskRes.data);
        dispatch({
          type: types.SORT_TASKS,
          taskCategories,
        });
    });
  });
}
