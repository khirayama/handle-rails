// import * from '../action';
import { subscribe } from '../libs/app-dispatcher';
import {
  changePage,
  backPage,
} from '../actions/app-action-creators';
import {
  getTaskCategories,
  editTaskCategory,
  updateTaskCategory,
  createTaskCategory,
  deleteTaskCategory,
  sortTaskCategories,
} from '../actions/task-category-action-creators';
import {
  createTask,
  completeTask,
  editTask,
  editNextTask,
  editPrevTask,
  updateTask,
  deleteTask,
  sortTasks,
} from '../actions/task-action-creators';


export default class EventRouter {
  constructor() {
    subscribe((event) => {
      switch (event.type) {
        // app
        case 'UI_CLICK_SETTINGS_BUTTON_IN_HEADER':
        case 'UI_CLICK_HELP_LINK_IN_SETTINGS_PAGE':
          changePage(event.link);
          break;
        case 'UI_CLICK_PAGE_BACK_BUTTON_IN_PAGE_BACK_BUTTON':
          backPage();
          break;
        // initialize
        case 'UI_START_APP':
          getTaskCategories();
          break;
        // component: task-page
        case 'UI_DRAGEND_ON_ITEM_IN_TASK_PAGE':
          sortTasks(event.id, event.taskCategoryId, event.order);
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
        // component: task-page
        case 'UI_CLICK_ADD_CATEGORY_BUTTON_IN_TASK_PAGE':
          createTaskCategory('');
          break;
        case 'UI_DRAGEND_ON_LIST_IN_TASK_PAGE':
          sortTaskCategories(event.id, event.order);
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
