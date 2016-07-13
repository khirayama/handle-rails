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
        // component: task-page
        case 'UI_CLICK_ADD_CATEGORY_BUTTON_IN_TASK_PAGE':
          createTaskCategory('');
          break;
        case 'UI_DRAGEND_ON_LIST_IN_TASK_PAGE':
          sortTaskCategories(event.from, event.to);
          break;
        // component: task-list
        case 'UI_CLICK_TITLE_IN_TASK_LIST':
          editTaskCategory(event.categoryId);
          break;
        case 'UI_KEYDOWN_TASK_CATEGORY_INPUT_WITH_ENTER_IN_TASK_LIST':
        case 'UI_KEYDOWN_TASK_CATEGORY_INPUT_WITH_ESC_IN_TASK_LIST':
        case 'UI_BLUR_TASK_CATEGORY_INPUT_IN_TASK_LIST':
          updateTaskCategory(
            event.categoryId,
            event.value
          );
          break;
        case 'UI_CLICK_DELETE_TASK_CATEGORY_BUTTON_IN_TASK_LIST':
          deleteTaskCategory(event.categoryId);
          break;
        default:
          break;
      }
    });
  }
}

export function editTaskCategory(id) {
  const entity = TaskCategory.get(id);

  entity.isEditing = true;

  dispatch({
    type: types.EDIT_TASK_CATEGORY,
    taskCategory: entity
  });
}

export function updateTaskCategory(id, name) {
  const entity = TaskCategory.update(id, { name });

  entity.isEditing = false;

  dispatch({
    type: types.UPDATE_TASK_CATEGORY,
    taskCategory: entity
  });
}

export function createTaskCategory(name) {
  const order = TaskCategory.all().length;
  const entity = TaskCategory.create({
    name,
    order,
  });

  entity.isEditing = true;

  dispatch({
    type: types.CREATE_TASK_CATEGORY,
    taskCategory: entity
  });
}

export function deleteTaskCategory(id) {
  const taskCategory = TaskCategory.get(id);
  const taskCategories = TaskCategory.all();
  const categoryTasks = Task.where({ categoryId: id }).get();

  // update other task category id
  taskCategories.forEach(taskCategory_ => {
    if (taskCategory.order < taskCategory_.order) {
      TaskCategory.update(taskCategory_.id, {
        order: taskCategory_.order - 1,
      });
    }
  });

  // remove task belonged this category
  categoryTasks.forEach(categoryTask => {
    Task.destroy(categoryTask.id);
  });

  TaskCategory.destroy(id);

  getTasks();
}

export function sortTaskCategories(from, to) {
  const allTaskCategories = TaskCategory.order('order').get();

  if (from < to) {
    // To move to down.
    for (let index = from; index <= to; index++) {
      const taskCategory = allTaskCategories[index];

      if (index === from) {
        TaskCategory.update(taskCategory.id, { order: to });
      } else if (index <= to) {
        TaskCategory.update(taskCategory.id, { order: taskCategory.order - 1 });
      }
    }
  } else if (to < from) {
    // To move to up.
    for (let index = to; index <= from; index++) {
      const taskCategory = allTaskCategories[index];

      if (index === from) {
        TaskCategory.update(taskCategory.id, { order: to });
      } else if (index <= from) {
        TaskCategory.update(taskCategory.id, { order: taskCategory.order + 1 });
      }
    }
  }

  getTasks();
}
