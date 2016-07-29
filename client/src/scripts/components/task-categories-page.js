import React, { Component } from 'react';

import TaskList from '../components/task-list';
import { dispatch } from '../libs/app-dispatcher';


const propTypes = {
  taskCategories: React.PropTypes.array.isRequired,
};

export default class TaskCategoriesPage extends Component {
  constructor(props) {
    super(props);

    this._isItemDragging = false;

    this._initializeOrder();
    this._initializeTaskCategoryOrder();

    this._setIsItemDragging = this._setIsItemDragging.bind(this);
    this._setNewOrder = this._setNewOrder.bind(this);
    this._moveTask = this._moveTask.bind(this);
    this._setNewTaskCategoryOrder = this._setNewTaskCategoryOrder.bind(this);
    this._moveTaskCategory = this._moveTaskCategory.bind(this);

    this.onClickAddCategoryButton = this.onClickAddCategoryButton.bind(this);
  }

  componentDidMount() {
    dispatch({ type: 'UI_START_TASK_CATEGORIES_PAGE' });
  }

  onClickAddCategoryButton() {
    dispatch({
      type: 'UI_CLICK_ADD_CATEGORY_BUTTON_IN_TASK_CATEGORIES_PAGE',
    });
  }

  _setIsItemDragging(isItemDragging) {
    this._isItemDragging = isItemDragging;
  }

  _initializeOrder() {
    this._order = {
      taskCategoryId: null,
      order: null,
    };
  }

  _setNewOrder(taskCategoryId, order) {
    this._order.taskCategoryId = taskCategoryId;
    this._order.order = order;
  }

  _moveTask(id) {
    if (this._isItemDragging) {
      dispatch({
        type: 'UI_DRAGEND_ON_ITEM_IN_TASK_CATEGORIES_PAGE',
        id,
        taskCategoryId: this._order.taskCategoryId,
        order: this._order.order,
      });
    }
    this._initializeOrder();
  }

  _initializeTaskCategoryOrder() {
    this._taskCategoryOrder = { to: null };
  }

  _setNewTaskCategoryOrder(order) {
    if (this._isItemDragging) {
      return;
    }
    this._taskCategoryOrder.order = order;
  }

  _moveTaskCategory(id) {
    if (!this._isItemDragging) {
      const order = this._taskCategoryOrder.order;

      dispatch({
        type: 'UI_DRAGEND_ON_LIST_IN_TASK_CATEGORIES_PAGE',
        id,
        order,
      });
    } else {
      this._isItemDragging = false;
    }
    this._initializeTaskCategoryOrder();
  }

  render() {
    const taskCategories = this.props.taskCategories;
    const taskListElements = taskCategories.map(taskCategory => (
      <section
        className="column task-list-column"
        key={taskCategory.id}
      >
        <TaskList
          taskCategory={taskCategory}
          setIsItemDragging={this._setIsItemDragging}
          setNewOrder={this._setNewOrder}
          moveTask={this._moveTask}
          setNewTaskCategoryOrder={this._setNewTaskCategoryOrder}
          moveTaskCategory={this._moveTaskCategory}
        />
      </section>
    ));

    return (
      <section className="page page__header tasks-page">
        <section className="page-content">
          <section className="column-container">
            {taskListElements}
          </section>
          <div
            className="floating-button"
            onClick={this.onClickAddCategoryButton}
          >
            <i className="icon">add</i>
          </div>
        </section>
      </section>
    );
  }
}

TaskCategoriesPage.propTypes = propTypes;
