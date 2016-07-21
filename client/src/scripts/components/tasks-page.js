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

    this._setIsItemDragging = this._setIsItemDragging.bind(this);

    this._setCurrentOrder = this._setCurrentOrder.bind(this);
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

  _setCurrentOrder(taskCategoryId, from) {
    this._order.from = from;
    this._order.currentCategoryId = taskCategoryId;
  }

  _setNewOrder(taskCategoryId, to) {
    this._order.to = to;
    this._order.newCategoryId = taskCategoryId;
  }

  _moveTask() {
    const currentTaskCategoryId = this._order.currentCategoryId;
    const from = this._order.from;
    const newTaskCategoryId = this._order.newCategoryId;
    const to = this._order.to;

    dispatch({
      type: 'UI_DRAGEND_ON_ITEM_IN_TASK_PAGE',
      from,
      to,
      currentTaskCategoryId,
      newTaskCategoryId,
    });

    this._initializeOrder();
    this._setIsItemDragging(false);
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
          setIsItemDragging={this._setIsItemDragging}
          setCurrentOrder={this._setCurrentOrder}
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
