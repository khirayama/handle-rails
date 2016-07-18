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
          if (event.currentCategoryId === event.newCategoryId) {
            sortTasks(event.currentCategoryId, event.from, event.to);
          } else {
            moveTask(event.currentCategoryId, event.from, event.newCategoryId, event.to);
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

export function getTasks() {
  const tasks = [];

  const allTaskCategories = TaskCategory.order('order').get();

  allTaskCategories.forEach(taskCategory => {
    tasks.push({
      categoryName: taskCategory.name,
      categoryId: taskCategory.id,
      order: taskCategory.order,
      isEditing: false,
      tasks: Task.where({ categoryId: taskCategory.id }).order('order').get(),
    });
  });

  validateByJSONSchema(tasks, TASKS_SCHEMA);

  for (let taskCategoryIndex = 0; taskCategoryIndex < tasks.length; taskCategoryIndex++) {
    const taskCategory = tasks[taskCategoryIndex];

    for (let taskIndex = 0; taskIndex < taskCategory.tasks.length; taskIndex++) {
      const task = taskCategory.tasks[taskIndex];

      task.isEditing = false;
    }
  }

  dispatch({
    type: types.GET_ALL_TASKS,
    tasks
  });
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

export function sortTasks(categoryId, from, to) {
  const tasks = Task.where({ categoryId }).order('order').get();

  if (from < to) {
    // To move to down.
    for (let index = from; index <= to; index++) {
      const task = tasks[index];

      if (index === from) {
        Task.update(task.id, { order: to });
      } else if (index <= to) {
        Task.update(task.id, { order: task.order - 1 });
      }
    }
  } else if (to < from) {
    // To move to up.
    for (let index = to; index <= from; index++) {
      const task = tasks[index];

      if (index === from) {
        Task.update(task.id, { order: to });
      } else if (index <= from) {
        Task.update(task.id, { order: task.order + 1 });
      }
    }
  }

  getTasks();
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

  getTasks();
}
