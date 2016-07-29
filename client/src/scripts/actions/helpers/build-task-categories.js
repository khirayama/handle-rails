export function buildTaskCategories(taskCategories, tasks) {
  const taskCategories_ = [];

  for(let taskCategoryIndex = 0; taskCategoryIndex < taskCategories.length; taskCategoryIndex++) {
    const taskCategory = taskCategories[taskCategoryIndex];
    const taskCategory_ = {
      id: taskCategory.id,
      name: taskCategory.name,
      order: taskCategory.order,
      tasks: [],
    };
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
      const task = tasks[taskIndex];
      if (taskCategory.id == task.task_category_id) {
        taskCategory_.tasks.push({
          id: task.id,
          text: task.text,
          completed: task.completed,
          order: task.order,
          taskCategoryId: task.task_category_id,
        });
      }
    }
    taskCategory_.tasks.sort((itemA, itemB) => {
      const valueX = itemA['order'];
      const valueY = itemB['order'];

      if (valueX > valueY) return 1;
      if (valueX < valueY) return -1;
      return 0;
    });
    taskCategories_.push(taskCategory_);
  }
  taskCategories_.sort((itemA, itemB) => {
    const valueX = itemA['order'];
    const valueY = itemB['order'];

    if (valueX > valueY) return 1;
    if (valueX < valueY) return -1;
    return 0;
  });
  return taskCategories_;
}
