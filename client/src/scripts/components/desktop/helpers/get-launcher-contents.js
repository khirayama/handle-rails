import TaskCategory from '../../../resources/task-category';
import { waitFor } from '../../../libs/app-dispatcher';
import { changeHistory } from '../../../actions/app-action-creators';
import { createTask } from '../../../actions/task-action-creators';
import { createTaskCategory } from '../../../actions/task-category-action-creators';
import { pages } from '../../../constants/constants';


export function getLauncherContents() {
  return new Promise((resolve) => {
    let taskCategoryItems = [];
    TaskCategory.fetch().then((res) => {
      taskCategoryItems = res.data.map((taskCategory) => {
        const id = taskCategory.id;
        const text = `Create a task to ${taskCategory.name}`;
        const callback = () => {
          const pathname = '/';
          if (pathname !== location.pathname) {
            waitFor('GET_ALL_TASK_CATEGORIES', () => {
              createTask('', id)
            });
            history.pushState(null, null, pathname);
            changeHistory(pathname);
          } else {
            createTask('', id);
          }
        };

        return { text, callback };
      });
      resolve([...taskCategoryItems, createCategoryItem, ...pageItems]);
    });

    const createCategoryItem = {
      text: 'Create a category',
      callback: () => {
        const pathname = '/';
        if (pathname !== location.pathname) {
          waitFor('GET_ALL_TASK_CATEGORIES', () => {
            createTaskCategory('');
          });
          history.pushState(null, null, pathname);
          changeHistory(pathname);
        } else {
          createTaskCategory('');
        }
      },
    };

    const pages = [{
      name: 'Task Categories Page',
      pathname: '/',
    }, {
      name: 'Settings Page',
      pathname: '/settings',
    }, {
      name: 'Help Page',
      pathname: '/help',
    }];
    const pageItems = pages.map(page => {
      const text = `Move to ${page.name}`;
      const callback = () => {
        if (page.pathname != location.pathname) {
          history.pushState(null, null, page.pathname);
        }
        changeHistory(page.pathname);
      };

      return { text, callback };
    });
  });
}
