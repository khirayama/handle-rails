import TaskCategory from '../resources/task-category';
import { changePage } from '../actions/app-action-creators';
import {
  createTask,
  createTaskCategory,
} from '../actions/task-action-creators';
import { pages } from '../constants/constants';


export function getLauncherContents() {
  // const taskCategoryItems = TaskCategory.order('order').get().map(taskCategory => {
  //   const id = taskCategory.id;
  //   const text = `Create a task to ${taskCategory.name}`;
  //   const callback = () => {
  //     changePage(pages.TASKS);
  //     createTask('', id);
  //   };
  //
  //   return { text, callback };
  // });
  const taskCategoryItems = [];

  const createCategoryItem = {
    text: 'Create a category',
    callback: () => {
      changePage(pages.TASKS);
      createTaskCategory('');
    },
  };

  const pageItems = Object.keys(pages).map(key => {
    const name_ = pages[key].replace(/_/g, ' ').toLowerCase();
    const name = name_.charAt(0).toUpperCase() + name_.slice(1);
    const href = pages[key];
    const text = `Move to ${name}`;
    const callback = () => {
      changePage(href);
    };

    return { text, callback };
  });

  return [...taskCategoryItems, createCategoryItem, ...pageItems];
}
