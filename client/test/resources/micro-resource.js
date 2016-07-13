import assert from 'power-assert';
import MicroResource from '../../src/scripts/resources/micro-resource';


describe('MicroResource', () => {
  let taskResource;

  beforeEach(() => {
    class Task extends MicroResource {
      constructor(options) {
        super(options);
        this.defaults = {
          text: '',
          completed: false,
        };
      }
    }
    taskResource = new Task({ localStorage: false });
  });

  describe('create', () => {
    it('an item', () => {
      taskResource.create({
        text: 'Hello World',
        completed: false,
      });

      const tasks = taskResource.all();
      const task = tasks[0];

      assert(1 === tasks.length);
      assert('Hello World' === task.text);
      assert(false === task.completed);
      assert(undefined !== task.id);
    });
  });

  describe('update', () => {
    let tasks;
    let task;

    beforeEach(() => {
      taskResource.create({
        text: 'Hello World',
        completed: true,
      });

      tasks = taskResource.all();
      task = tasks[0];
    });

    it('all', () => {
      task = taskResource.update(task.id, {
        text: 'Hello New World',
        completed: true,
      });

      assert(task.text === 'Hello New World');
      assert(task.completed === true);
    });

    it('text', () => {
      task = taskResource.update(task.id, {
        text: 'Hello New World',
      });

      assert(task.text === 'Hello New World');
    });
  });

  describe('destroy', () => {
    let tasks;
    let task;

    beforeEach(() => {
      taskResource.create({
        text: 'Hello World',
        completed: true,
      });

      tasks = taskResource.all();
      task = tasks[0];
    });

    it('an item', () => {
      taskResource.destroy(task.id);

      tasks = taskResource.all();
      assert(tasks.length === 0);
    });
  });

  describe('drop', () => {
    let tasks;
    let task;

    beforeEach(() => {
      taskResource.create({
        text: 'Hello World',
        completed: true,
      });
      taskResource.create({
        text: 'Hello World 2',
        completed: true,
      });
      taskResource.create({
        text: 'Hello World 3',
        completed: true,
      });

      tasks = taskResource.all();
      task = tasks[0];
    });

    it('all item', () => {
      assert(tasks.length === 3);

      taskResource.drop();

      tasks = taskResource.all();
      assert(tasks.length === 0);
    });
  });

  describe('get', () => {
    let tasks;
    let task;

    beforeEach(() => {
      taskResource.create({
        text: 'Hello World',
        completed: true,
      });

      tasks = taskResource.all();
      task = tasks[0];
    });

    it('an item', () => {
      task = taskResource.get(task.id);

      assert(task.text === 'Hello World');
      assert(task.completed === true);
    });
  });

  describe('all', () => {
    let tasks;
    let task;

    beforeEach(() => {
      taskResource.create({
        text: 'Hello World',
        completed: true,
      });
      taskResource.create({
        text: 'Hello World 2',
        completed: true,
      });

      tasks = taskResource.all();
      task = tasks[0];
    });

    it('all item', () => {
      assert(tasks.length === 2);
    });
  });

  describe('where', () => {
    let tasks;
    let task;

    beforeEach(() => {
      taskResource.create({
        text: 'Hello World',
        completed: true,
      });
      taskResource.create({
        text: 'Hello World 2',
        completed: true,
      });
      taskResource.create({
        text: 'Hello World 3',
        completed: false,
      });
    });

    it('text', () => {
      tasks = taskResource.where({ text: 'Hello World' }).get();

      assert(tasks.length === 1);
      assert(tasks[0].text === 'Hello World');
    });

    it('bool', () => {
      tasks = taskResource.where({ completed: true }).get();

      assert(tasks.length === 2);
      assert(tasks[0].text === 'Hello World');
      assert(tasks[1].text === 'Hello World 2');
    });
  });

  describe('order', () => {
    let tasks;
    let task;

    beforeEach(() => {
      taskResource.create({
        text: 'Hello World',
        completed: true,
      });
      taskResource.create({
        text: 'Hello World 2',
        completed: true,
      });
      taskResource.create({
        text: 'Hello World 3',
        completed: false,
      });
    });

    describe('text', () => {
      it('normal', () => {
        tasks = taskResource.order('text').get();

        assert(tasks.length === 3);
        assert(tasks[0].text === 'Hello World');
        assert(tasks[1].text === 'Hello World 2');
        assert(tasks[2].text === 'Hello World 3');
      });

      it('reserse', () => {
        tasks = taskResource.order('text', true).get();

        assert(tasks.length === 3);
        assert(tasks[0].text === 'Hello World 3');
        assert(tasks[1].text === 'Hello World 2');
        assert(tasks[2].text === 'Hello World');
      });
    });

    describe('bool', () => {
      it('normal', () => {
        tasks = taskResource.order('completed').get();

        assert(tasks.length === 3);
        assert(tasks[0].text === 'Hello World 3');
        assert(tasks[1].text === 'Hello World');
        assert(tasks[2].text === 'Hello World 2');
      });

      it('reserse', () => {
        tasks = taskResource.order('completed', true).get();

        assert(tasks.length === 3);
        assert(tasks[0].text === 'Hello World');
        assert(tasks[1].text === 'Hello World 2');
        assert(tasks[2].text === 'Hello World 3');
      });
    });
  });

  describe('limit', () => {
    let tasks;
    let task;

    beforeEach(() => {
      taskResource.create({
        text: 'Hello World',
        completed: true,
      });
      taskResource.create({
        text: 'Hello World 2',
        completed: true,
      });
      taskResource.create({
        text: 'Hello World 3',
        completed: false,
      });
    });

    it('top 2', () => {
      tasks = taskResource.limit(2).get();

      assert(tasks.length === 2);
      assert(tasks[0].text === 'Hello World');
      assert(tasks[1].text === 'Hello World 2');
    });
  });
});
