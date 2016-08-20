import { actionTypes as types } from '../constants/constants';
import { parseTextToItem } from '../utils/text-to-schedule-parser';


function _addSchedule(task) {
  const taskWithSchedule = parseTextToItem(task.text);
  const newTask = Object.assign({}, task, {
    scheduleText: taskWithSchedule.text,
    schedule: taskWithSchedule.schedule,
  });

  return newTask;
}

export function createTaskCategory(taskCategories, taskCategory) {
  return [...taskCategories, (Object.assign({}, taskCategory))];
}

export function setTaskCategories(taskCategories) {
  return taskCategories.map((taskCategory) => {
    taskCategory.tasks = taskCategory.tasks.map((task) => {
      return _addSchedule(task);
    });
    return Object.assign({}, taskCategory);
  });
}

export function updateTaskCategory(taskCategories, taskCategory) {
  return taskCategories.map((taskCategory_) => {
    if (taskCategory.id === taskCategory_.id) {
      return Object.assign({}, taskCategory_, taskCategory);
    }
    return Object.assign({}, taskCategory_);
  });
}

export function deleteTaskCategory(taskCategories, deletedTaskCategoryId) {
  return taskCategories.map((taskCategory) => {
    if (taskCategory.id !== deletedTaskCategoryId) {
      return Object.assign({}, taskCategory);
    }
  }).filter(taskCategory => Boolean(taskCategory)).map((taskCategory, index) => {
    // make order sequence
    taskCategory.order = index;
    return Object.assign({}, taskCategory);
  });
}

export function unshiftTaskCategories(taskCategories) {
  const newTaskCategories = taskCategories.map((taskCategory) => {
    return Object.assign({} , taskCategory);
  });
  newTaskCategories.unshift(newTaskCategories.pop());
  return newTaskCategories;
}

export function pushTaskCategories(taskCategories) {
  const newTaskCategories = taskCategories.map((taskCategory) => {
    return Object.assign({} , taskCategory);
  });
  newTaskCategories.push(newTaskCategories.shift());
  return newTaskCategories;
}

export function createTask(taskCategories, task) {
  const newTask = _addSchedule(task);

  return taskCategories.map(taskCategory => {
    if (taskCategory.id === task.taskCategoryId) {
      taskCategory.tasks = [...taskCategory.tasks, newTask];
    }
    return Object.assign({}, taskCategory);
  });
}

export function updateTask(taskCategories, task) {
  const newTask = _addSchedule(task);

  return taskCategories.map(taskCategory => {
    if (taskCategory.id === task.taskCategoryId) {
      taskCategory.tasks = taskCategory.tasks.map((task_) => {
        if (task_.id === task.id) {
          return Object.assign({}, task_, task);
        }
        return Object.assign({}, task_);
      });
    }
    return Object.assign({}, taskCategory);
  });
}

export function updateTasks(taskCategories, tasks) {
  return taskCategories.map(taskCategory => {
    if (taskCategory.id === task.taskCategoryId) {
      taskCategory.tasks = taskCategory.tasks.map((task_) => {
        for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
          const task = tasks[taskIndex];
          const newTask = _addSchedule(task);
          if (task_.id === newTask.id) {
            return Object.assign({}, task_, task);
          }
        }
        return Object.assign({}, task_);
      });
    }
    return Object.assign({}, taskCategory);
  });
}

export function deleteTask(taskCategories, deletedTaskId) {
  return taskCategories.map((taskCategory) => {
    taskCategory.tasks = taskCategory.tasks.map((task) => {
      if (task.id !== deletedTaskId) {
        return Object.assign({}, task);
      }
    }).filter(task => Boolean(task));
    return Object.assign({}, taskCategory);
  });
}



export default function taskCategories(state, action) {
  switch (action.type) {
    case types.CREATE_TASK_CATEGORY:
      return createTaskCategory(state, action.taskCategory);
    case types.GET_ALL_TASK_CATEGORIES:
    case types.SORT_TASK_CATEGORIES:
    case types.SORT_TASKS:
      return setTaskCategories(action.taskCategories);
    case types.EDIT_TASK_CATEGORY:
    case types.UPDATE_TASK_CATEGORY:
      return updateTaskCategory(state, action.taskCategory);
    case types.DELETE_TASK_CATEGORY:
      return deleteTaskCategory(state, action.deletedTaskCategoryId);
    case types.PUSH_TASK_CATEORIES:
      return pushTaskCategories(state);
    case types.UNSHIFT_TASK_CATEORIES:
      return unshiftTaskCategories(state);

    case types.CREATE_TASK:
      return createTask(state, action.task);
    case types.UPDATE_TASK:
      return updateTask(state, action.task);
    case types.UPDATE_TASKS:
      return updateTasks(state, action.tasks);
    case types.DELETE_TASK:
      return deleteTask(state, action.deletedTaskId);
    default:
      return state;
  }
}

