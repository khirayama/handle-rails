import React, { Component } from 'react';

import TaskList from '../components/task-list';
import { dispatch } from '../libs/app-dispatcher';


const propTypes = {
  tasks: React.PropTypes.array.isRequired,
};

export default class TasksPage extends Component {
  constructor(props) {
    super(props);

    this._isItemDragging = false;

    this._initializeOrder();
    this._initializeTaskCategoryOrder();

    this._setIsItemDragging = this._setIsItemDragging.bind(this);

    this._setCurrentOrder = this._setCurrentOrder.bind(this);
    this._setNewOrder = this._setNewOrder.bind(this);
    this._moveTask = this._moveTask.bind(this);

    this._setCurrentTaskCategoryOrder = this._setCurrentTaskCategoryOrder.bind(this);
    this._setNewTaskCategoryOrder = this._setNewTaskCategoryOrder.bind(this);
    this._moveTaskCategory = this._moveTaskCategory.bind(this);

    this.onClickAddCategoryButton = this.onClickAddCategoryButton.bind(this);
  }

  onClickAddCategoryButton() {
    dispatch({
      type: 'UI_CLICK_ADD_CATEGORY_BUTTON_IN_TASK_PAGE',
    });
  }

  _setIsItemDragging(isItemDragging) {
    this._isItemDragging = isItemDragging;
  }

  _initializeOrder() {
    this._order = {
      from: null,
      currentCategoryId: '',
      to: null,
      newCategoryId: '',
    };
  }

  _setCurrentOrder(categoryId, from) {
    this._order.from = from;
    this._order.currentCategoryId = categoryId;
  }

  _setNewOrder(categoryId, to) {
    this._order.to = to;
    this._order.newCategoryId = categoryId;
  }

  _moveTask() {
    const currentCategoryId = this._order.currentCategoryId;
    const from = this._order.from;
    const newCategoryId = this._order.newCategoryId;
    const to = this._order.to;

    dispatch({
      type: 'UI_DRAGEND_ON_ITEM_IN_TASK_PAGE',
      from,
      to,
      currentCategoryId,
      newCategoryId,
    });

    this._initializeOrder();
    this._setIsItemDragging(false);
  }

  _initializeTaskCategoryOrder() {
    this._taskCategoryOrder = {
      from: null,
      to: null,
    };
  }

  _setCurrentTaskCategoryOrder(from) {
    if (this._isItemDragging) {
      return;
    }
    this._taskCategoryOrder.from = from;
  }

  _setNewTaskCategoryOrder(to) {
    if (this._isItemDragging) {
      return;
    }
    this._taskCategoryOrder.to = to;
  }

  _moveTaskCategory() {
    if (this._isItemDragging) {
      return;
    }
    const from = this._taskCategoryOrder.from;
    const to = this._taskCategoryOrder.to;

    if (from !== null && to !== null && from !== to) {
      dispatch({
        type: 'UI_DRAGEND_ON_LIST_IN_TASK_PAGE',
        from,
        to,
      });
    }
    this._initializeTaskCategoryOrder();
  }

  render() {
    const tasks = this.props.tasks;
    const taskListElements = tasks.map(taskCategory => (
      <section
        className="column task-list-column"
        key={taskCategory.categoryId}
      >
        <TaskList
          taskCategory={taskCategory}
          setIsItemDragging={this._setIsItemDragging}
          setCurrentOrder={this._setCurrentOrder}
          setNewOrder={this._setNewOrder}
          moveTask={this._moveTask}
          setCurrentTaskCategoryOrder={this._setCurrentTaskCategoryOrder}
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
