import assert from 'power-assert';

import {
  getTasks,
  createTask,
  completeTask,
  editTask,
  updateTask,
  deleteTask,
  sortTasks,
} from '../../src/scripts/actions/task-action-creators';
import taskResource from '../../src/scripts/resources/task';
import taskCategoryResource from '../../src/scripts/resources/task-category';
import { subscribe, unsubscribeAll } from '../../src/scripts/dispatchers/app-dispatcher';
import { actionTypes as types, initialTaskCategoryNames } from '../../src/scripts/constants/constants';


describe('TaskActionCreators', () => {
  let taskCategoryId;

  beforeEach(() => {
    taskResource.drop();
    taskCategoryResource.drop();
    taskCategoryResource.init();
    taskCategoryId = taskCategoryResource.all()[0].id;
    unsubscribeAll();
  });

  describe('getTasks', () => {
    it('get all tasks', (done) => {
      subscribe((action) => {
        switch (action.type) {
          case types.GET_ALL_TASKS:
            assert(action.tasks[0].categoryName === initialTaskCategoryNames.TODAY);
            assert(action.tasks[1].categoryName === initialTaskCategoryNames.LATER);
            assert(action.tasks[2].categoryName === initialTaskCategoryNames.SCHEDULE);
            done();
            break;
        }
      });
      getTasks();
    });
  });

  describe('createTask', () => {
    it('an item', (done) => {
      subscribe((action) => {
        switch (action.type) {
          case types.CREATE_TASK:
            assert(action.task.id !== undefined);
            assert(action.task.text === 'Hello World');
            assert(action.task.completed === false);
            done();
            break;
        }
      });
      createTask('Hello World', taskCategoryId);
    });
  });

  describe('editTask', () => {
    it('an item', (done) => {
      subscribe((action) => {
        switch (action.type) {
          case types.UPDATE_TASK:
            assert(action.task.id !== undefined);
            done();
            break;
        }
      });
      createTask('Hello World', taskCategoryId);

      const tasks = taskResource.all();
      const task_ = tasks[0];

      editTask(task_.id);
    });
  });

  describe('updateTask', () => {
    it('an item', (done) => {
      subscribe((action) => {
        switch (action.type) {
          case types.UPDATE_TASK:
            assert(action.task.id !== undefined);
            assert(action.task.text === 'Hello New World');
            assert(action.task.completed === false);
            done();
            break;
        }
      });
      createTask('Hello World', taskCategoryId);

      const tasks = taskResource.all();
      const task_ = tasks[0];

      updateTask(task_.id, 'Hello New World');
    });
  });

  describe('completeTask', () => {
    it('an item', (done) => {
      subscribe((action) => {
        switch (action.type) {
          case types.UPDATE_TASK:
            assert(action.task.id !== undefined);
            assert(action.task.text === 'Hello World');
            assert(action.task.completed === true);
            done();
            break;
        }
      });
      createTask('Hello World', taskCategoryId);

      const tasks = taskResource.all();
      const task_ = tasks[0];

      completeTask(task_.id);
    });
  });

  describe('deleteTask', () => {
    it('an item', (done) => {
      subscribe((action) => {
        switch (action.type) {
          case types.GET_ALL_TASKS:
            // num of task categories is 3
            assert(action.tasks[0].tasks.length === 0);
            assert(action.tasks[1].tasks.length === 0);
            assert(action.tasks[2].tasks.length === 0);
            done();
            break;
        }
      });
      createTask('Hello World', taskCategoryId);

      const tasks = taskResource.all();
      const task_ = tasks[0];

      deleteTask(task_.categoryId, task_.id);
    });
  });

  describe('sortTasks', () => {
    it('from < to', (done) => {
      subscribe((action) => {
        switch (action.type) {
          case types.GET_ALL_TASKS:
            assert(action.tasks[0].tasks.length === 3);
            assert(action.tasks[0].tasks[0].text === 'Hello World 1');
            assert(action.tasks[0].tasks[1].text === 'Hello World 0');
            done();
            break;
        }
      });
      createTask('Hello World 0', taskCategoryId);
      createTask('Hello World 1', taskCategoryId);
      createTask('Hello World 2', taskCategoryId);
      sortTasks(taskCategoryId, 0, 1);
    });
    it('to < from', (done) => {
      subscribe((action) => {
        switch (action.type) {
          case types.GET_ALL_TASKS:
            assert(action.tasks[0].tasks.length === 3);
            assert(action.tasks[0].tasks[0].text === 'Hello World 1');
            assert(action.tasks[0].tasks[1].text === 'Hello World 0');
            done();
            break;
        }
      });
      createTask('Hello World 0', taskCategoryId);
      createTask('Hello World 1', taskCategoryId);
      createTask('Hello World 2', taskCategoryId);
      sortTasks(taskCategoryId, 1, 0);
    });
  });
});
