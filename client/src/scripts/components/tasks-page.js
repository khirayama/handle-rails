import React, { Component } from 'react';

import TaskList from '../components/task-list';
import { dispatch } from '../libs/app-dispatcher';


const propTypes = {
  taskCategories: React.PropTypes.array.isRequired,
};

export default class TasksPage extends Component {
  constructor(props) {
    super(props);

    this._isItemDragging = false;

    this._initializeOrder();
    this._initializeTaskCategoryOrder();

    this._setNewOrder = this._setNewOrder.bind(this);
    this._moveTask = this._moveTask.bind(this);

    this._setNewTaskCategoryOrder = this._setNewTaskCategoryOrder.bind(this);
    this._moveTaskCategory = this._moveTaskCategory.bind(this);

    this.onClickAddCategoryButton = this.onClickAddCategoryButton.bind(this);
  }

  onClickAddCategoryButton() {
    dispatch({
      type: 'UI_CLICK_ADD_CATEGORY_BUTTON_IN_TASK_PAGE',
    });
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
    dispatch({
      type: 'UI_DRAGEND_ON_ITEM_IN_TASK_PAGE',
      id,
      taskCategoryId: this._order.taskCategoryId,
      order: this._order.order,
    });

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
    if (this._isItemDragging) {
      return;
    }
    const order = this._taskCategoryOrder.order;

    dispatch({
      type: 'UI_DRAGEND_ON_LIST_IN_TASK_PAGE',
      id,
      order,
    });
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
          setNewOrder={this._setNewOrder}
          moveTask={this._moveTask}
          setNewTaskCategoryOrder={this._setNewTaskCategoryOrder}
          moveTaskCategory={this._moveTaskCategory}
        />
      </section>
    ));

    return (
      <section className="page tasks-page">
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

TasksPage.propTypes = propTypes;
