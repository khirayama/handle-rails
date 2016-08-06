import { dispatch, subscribe } from '../libs/app-dispatcher';
import Task from '../resources/task';
import TaskCategory from '../resources/task-category';
import { actionTypes as types } from '../constants/constants';
import { buildTaskCategories } from './helpers/build-task-categories';


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

export function editNextTask(id) {
  Task.fetch().then((taskRes) => {
    TaskCategory.fetch().then((taskCategoryRes) => {
      const taskCategories = buildTaskCategories(taskCategoryRes.data, taskRes.data);
      Task.find(id).then((res) => {
        const currentTask = res.data;
        for (let taskCategoryIndex = 0; taskCategoryIndex < taskCategories.length; taskCategoryIndex++) {
          const taskCategory = taskCategories[taskCategoryIndex];
          for (let taskIndex = 0; taskIndex < taskCategory.tasks.length; taskIndex++) {
            const task = taskCategory.tasks[taskIndex];
            if (task.id === currentTask.id) {
              const nextTask = taskCategory.tasks[taskIndex + 1];
              if (nextTask) {
                dispatch({
                  type: types.UPDATE_TASKS,
                  tasks: [{
                    id: currentTask.id,
                    text: currentTask.text,
                    completed: currentTask.completed,
                    taskCategoryId: currentTask.task_category_id,
                    order: currentTask.order,
                    isEditing: false,
                  }, {
                    id: nextTask.id,
                    text: nextTask.text,
                    completed: nextTask.completed,
                    taskCategoryId: nextTask.taskCategoryId,
                    order: nextTask.order,
                    isEditing: true,
                  }],
                });
              }
            }
          }
        }
      });
    });
  });
}

export function editPrevTask(id) {
  Task.fetch().then((taskRes) => {
    TaskCategory.fetch().then((taskCategoryRes) => {
      const taskCategories = buildTaskCategories(taskCategoryRes.data, taskRes.data);
      Task.find(id).then((res) => {
        const currentTask = res.data;
        for (let taskCategoryIndex = 0; taskCategoryIndex < taskCategories.length; taskCategoryIndex++) {
          const taskCategory = taskCategories[taskCategoryIndex];
          for (let taskIndex = 0; taskIndex < taskCategory.tasks.length; taskIndex++) {
            const task = taskCategory.tasks[taskIndex];
            if (task.id === currentTask.id) {
              const prevTask = taskCategory.tasks[taskIndex - 1];
              if (prevTask) {
                dispatch({
                  type: types.UPDATE_TASKS,
                  tasks: [{
                    id: currentTask.id,
                    text: currentTask.text,
                    completed: currentTask.completed,
                    taskCategoryId: currentTask.task_category_id,
                    order: currentTask.order,
                    isEditing: false,
                  }, {
                    id: prevTask.id,
                    text: prevTask.text,
                    completed: prevTask.completed,
                    taskCategoryId: prevTask.taskCategoryId,
                    order: prevTask.order,
                    isEditing: true,
                  }],
                });
              }
            }
          }
        }
      });
    });
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

export function sortTasks(id, taskCategoryId, order) {
  Task.reorder({
    id,
    task_category_id: taskCategoryId,
    order
  }).then((taskRes) => {
    TaskCategory.fetch().then((taskCategoryRes) => {
      const taskCategories = buildTaskCategories(taskCategoryRes.data, taskRes.data);
        dispatch({
          type: types.SORT_TASKS,
          taskCategories,
        });
    });
  });
}
