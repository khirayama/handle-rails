import { dispatch, subscribe } from '../libs/app-dispatcher';
import Task from '../resources/task';
import TaskCategory from '../resources/task-category';
import { actionTypes as types } from '../constants/constants';
import { validateByJSONSchema } from '../json-schemas/json-schema';
import { TASK_SCHEMA, TASKS_SCHEMA } from '../json-schemas/task';


export default class TaskActionSubscriber {
  constructor() {
    subscribe((event) => {
      switch (event.type) {
        // component: task-page
        case 'UI_DRAGEND_ON_ITEM_IN_TASK_PAGE':
          if (event.currentTaskCategoryId === event.newTaskCategoryId) {
            sortTasks(event.currentTaskCategoryId, event.from, event.to);
          } else {
            moveTask(event.currentTaskCategoryId, event.from, event.newTaskCategoryId, event.to);
          }
          break;
        // component: task-list
        case 'UI_CLICK_ADD_BUTTON_IN_TASK_LIST':
          createTask('', event.taskCategoryId);
          break;
        // component: task-list-item
        case 'UI_KEYDOWN_INPUT_WITH_ENTER_AND_CTRL_IN_TASK_LIST_ITEM':
          if (event.value === '') {
            deleteTask(event.id);
          }
          createTask('', event.categoryId);
          break;
        case 'UI_CLICK_DONE_BUTTON':
          completeTask(event.id);
          break;
        case 'UI_CLICK_LABEL':
          editTask(event.id);
          break;
        case 'UI_KEYDOWN_INPUT_WITH_TAB_IN_TASK_LIST_ITEM':
          editNextTask(event.categoryId, event.order);
          break;
        case 'UI_KEYDOWN_INPUT_WITH_TAB_AND_SHIFT_IN_TASK_LIST_ITEM':
          editPrevTask(event.categoryId, event.order);
          break;
        case 'UI_BLUR_INPUT_IN_TASK_LIST_ITEM':
        case 'UI_KEYDOWN_INPUT_WITH_ENTER_IN_TASK_LIST_ITEM':
        case 'UI_KEYDOWN_INPUT_WITH_ESC_IN_TASK_LIST_ITEM':
          const text = event.text.trim();

          if (text !== '') {
            updateTask(event.id, text);
          } else {
            deleteTask(event.id);
          }
          break;
        case 'UI_CLICK_DELETE_BUTTON_IN_TASK_LIST_ITEM':
          deleteTask(event.id);
          break;
        default:
          break;
      }
    });
  }
}

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

  validateByJSONSchema(entity, TASK_SCHEMA);

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

  validateByJSONSchema(entity, TASK_SCHEMA);

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

export function sortTasks(taskCategoryId, from, to) {
  Task.reorder({
    task_category_id: taskCategoryId,
    from,
    to
  }).then((res) => {
    const tasks = res.data.map((task) => {
      return {
        id: task.id,
        text: task.text,
        completed: task.completed,
        taskCategoryId: task.task_category_id,
        order: task.order,
        isEditing: false,
      };
    });
    dispatch({
      type: types.SORT_TASKS,
      taskCategoryId,
      tasks,
    });
  });
}

export function moveTask(currentCategoryId, from, newCategoryId, to) {
  const currentTask = Task
                        .where({ categoryId: currentCategoryId })
                        .where({ order: from })
                        .first();

  const newCategoryTasks = Task.where({ categoryId: newCategoryId }).order('order').get();

  newCategoryTasks.forEach(newCategoryTask => {
    const order = newCategoryTask.order;

    if (order >= to) {
      Task.update(newCategoryTask.id, {
        order: newCategoryTask.order + 1,
      });
    }
  });

  Task.update(currentTask.id, {
    order: to,
    categoryId: newCategoryId,
  });

  const currentCategoryTasks = Task
                                 .where({ categoryId: currentCategoryId })
                                 .order('order')
                                 .get();

  currentCategoryTasks.forEach(currentCategoryTask => {
    const order = currentCategoryTask.order;

    if (order >= from) {
      Task.update(currentCategoryTask.id, {
        order: currentCategoryTask.order - 1,
      });
    }
  });
}
