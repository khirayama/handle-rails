import assert from 'power-assert';

import { TaskCategoryResource } from '../../src/scripts/resources/task-category';
import { initialTaskCategoryNames } from '../../src/scripts/constants/constants';


describe('TaskCategoryResource', () => {
  let taskCategoryResource;

  beforeEach(() => {
    taskCategoryResource = new TaskCategoryResource({ localStorage: false });
  });

  describe('init', () => {
    let taskCategories;
    afterEach(() => {
      assert(taskCategories.length === 3);
      assert(taskCategories[0].name === initialTaskCategoryNames.TODAY);
      assert(taskCategories[0].order === 0);

      assert(taskCategories[1].name === initialTaskCategoryNames.LATER);
      assert(taskCategories[1].order === 1);

      assert(taskCategories[2].name === initialTaskCategoryNames.SCHEDULE);
      assert(taskCategories[2].order === 2);
    });

    it('init', () => {
      taskCategoryResource.drop();

      taskCategories = taskCategoryResource.all();

      assert(taskCategories.length === 0);

      taskCategoryResource.init();
      taskCategories = taskCategoryResource.all();
    });

    it('constructor', () => {
      taskCategories = taskCategoryResource.all();
    });
  });

  describe('create', () => {
    it('an item with order', () => {
      taskCategoryResource.drop();

      let taskCategories = taskCategoryResource.all();

      taskCategoryResource.create({
        name: 'Hello World',
        order: taskCategories.length,
      });

      taskCategories = taskCategoryResource.all();

      assert(taskCategories.length === 1);

      assert(taskCategories[0].id !== undefined);
      assert(taskCategories[0].name === 'Hello World');
      assert(taskCategories[0].order === 0);
    });

    it('2 items with order', () => {
      taskCategoryResource.drop();

      let taskCategories = taskCategoryResource.all();

      taskCategoryResource.create({
        name: 'Hello World',
        order: taskCategories.length,
      });

      taskCategories = taskCategoryResource.all();

      taskCategoryResource.create({
        name: 'Hello World 2',
        order: taskCategories.length,
      });

      taskCategories = taskCategoryResource.all();

      assert(taskCategories.length === 2);

      assert(taskCategories[0].id !== undefined);
      assert(taskCategories[0].name === 'Hello World');
      assert(taskCategories[0].order === 0);

      assert(taskCategories[1].id !== undefined);
      assert(taskCategories[1].name === 'Hello World 2');
      assert(taskCategories[1].order === 1);
    });
  });
});
