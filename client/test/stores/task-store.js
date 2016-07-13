import assert from 'power-assert';

import TaskStore from '../../src/scripts/stores/task-state';


describe('TaskStore', () => {
  let taskStore;
  let tasks;

  beforeEach(() => {
    taskStore = new TaskStore();
    taskStore.setTasks([{
      categoryName: 'AAA',
      categoryId: 'id-AAA',
      otherCategories: [],
      tasks: [{
        categoryId: 'category-id-AAA-0',
        id: 'id-AAA-0',
        text: 'Hello World A',
        completed: false,
        order: 0,
        schedule: null,
        scheduleText: '',
        isEditing: false,
      }, {
        categoryId: 'category-id-AAA-1',
        id: 'id-AAA-1',
        text: 'Hello World A 2',
        completed: false,
        order: 1,
        schedule: null,
        scheduleText: '',
        isEditing: false,
      }, {
        categoryId: 'category-id-AAA-2',
        id: 'id-AAA-2',
        text: 'fri Hello World A 3',
        completed: false,
        order: 2,
        schedule: null,
        scheduleText: '',
        isEditing: false,
      }],
    }, {
      categoryName: 'BBB',
      categoryId: 'id-BBB',
      otherCategories: [],
      tasks: [{
        categoryId: 'category-id-BBB-0',
        id: 'id-BBB-0',
        text: 'Hello World B',
        completed: false,
        order: 0,
        schedule: null,
        scheduleText: '',
        isEditing: false,
      }],
    }]);
  });

  describe('setTasks', () => {
    it('initial', () => {
      tasks = taskStore._tasks;

      assert(tasks[0].tasks[2].schedule !== null);
      assert(tasks[0].tasks[2].schedule.dayName === 'Friday');
    });
  });

  describe('create', () => {
    it('an item', () => {
      taskStore.create({
        categoryId: 'id-BBB',
        id: 'id-BBB-1',
        text: 'Hello World B 2',
        completed: false,
        order: 1,
        schedule: null,
        scheduleText: '',
        isEditing: false,
      });

      tasks = taskStore._tasks;

      assert(tasks[1].tasks.length === 2);
      assert(tasks[1].tasks[1].text === 'Hello World B 2');
      assert(tasks[1].tasks[1].schedule === null);
    });
  });

  describe('update', () => {
    it('an item', () => {
      taskStore.update({
        categoryId: 'id-BBB',
        id: 'id-BBB-0',
        text: 'Hello New World B',
        completed: false,
        order: 1,
        schedule: null,
        scheduleText: '',
        isEditing: false,
      });

      tasks = taskStore._tasks;

      assert(tasks[1].tasks.length === 1);
      assert(tasks[1].tasks[0].text === 'Hello New World B');
      assert(tasks[1].tasks[0].schedule === null);
    });
  });

  describe('apply parseTextToItem', () => {
    it('fri meets my friends', () => {
      taskStore.create({
        categoryId: 'id-BBB',
        id: 'id-BBB-1',
        text: 'fri meets my friends',
        completed: false,
        order: 1,
        schedule: null,
        scheduleText: '',
        isEditing: false,
      });

      tasks = taskStore._tasks;

      assert(tasks[1].tasks.length === 2);
      assert(tasks[1].tasks[1].text === 'fri meets my friends');
      assert(tasks[1].tasks[1].scheduleText === 'meets my friends');
      assert(tasks[1].tasks[1].schedule.year !== undefined);
    });
  });
});
