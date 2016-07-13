import assert from 'power-assert';

import { TaskResource } from '../../src/scripts/resources/task';


describe('TaskResource', () => {
  let taskResource;

  beforeEach(() => {
    taskResource = new TaskResource({ localStorage: false });
  });

  describe('create', () => {
    it('an item with order', () => {
      let tasks = taskResource.all();

      taskResource.create({
        text: 'Hello World',
        completed: false,
        order: tasks.length,
      });

      tasks = taskResource.all();

      assert(tasks.length === 1);

      assert(tasks[0].id !== undefined);
      assert(tasks[0].text === 'Hello World');
      assert(tasks[0].completed === false);
      assert(tasks[0].order === 0);
    });

    it('2 items with order', () => {
      let tasks = taskResource.all();

      taskResource.create({
        text: 'Hello World',
        completed: false,
        order: tasks.length,
      });

      tasks = taskResource.all();

      taskResource.create({
        text: 'Hello World 2',
        completed: false,
        order: tasks.length,
      });

      tasks = taskResource.all();

      assert(tasks.length === 2);

      assert(tasks[0].id !== undefined);
      assert(tasks[0].text === 'Hello World');
      assert(tasks[0].completed === false);
      assert(tasks[0].order === 0);

      assert(tasks[1].id !== undefined);
      assert(tasks[1].text === 'Hello World 2');
      assert(tasks[1].completed === false);
      assert(tasks[1].order === 1);
    });
  });
});
