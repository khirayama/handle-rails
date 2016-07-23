import React, { Component } from 'react';

import {
  messages,
  keyCodes,
} from '../constants/constants';
import promiseConfirm from '../utils/promise-confirm';
import TaskListItem from './task-list-item';
import { dispatch } from '../libs/app-dispatcher';


const taskListPropTypes = {
  taskCategory: React.PropTypes.object,
  setNewOrder: React.PropTypes.func.isRequired,
  moveTask: React.PropTypes.func.isRequired,
  setNewTaskCategoryOrder: React.PropTypes.func.isRequired,
  moveTaskCategory: React.PropTypes.func.isRequired,
};

export default class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.taskCategory.name,
    };

    this.onClickTitle = this.onClickTitle.bind(this);
    this.onClickAddButton = this.onClickAddButton.bind(this);
    this.onClickDeleteTaskCategoryButton = this.onClickDeleteTaskCategoryButton.bind(this);
    this.onBlurTaskCategoryInput = this.onBlurTaskCategoryInput.bind(this);
    this.onKeyDownTaskCategoryInput = this.onKeyDownTaskCategoryInput.bind(this);
    this.onChangeTaskCategoryInput = this.onChangeTaskCategoryInput.bind(this);
    this.onDragEnterHeader = this.onDragEnterHeader.bind(this);
    this.onDragEndHeader = this.onDragEndHeader.bind(this);
    this.onDragEnterAddButton = this.onDragEnterAddButton.bind(this);
    this.onDragEndAddButton = this.onDragEndAddButton.bind(this);
    this.onDragEnterList = this.onDragEnterList.bind(this);
    this.onDragEndList = this.onDragEndList.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.taskCategory.isEditing && (prevState.value === this.state.value)) {
      this._selectInputValue();
    }
  }

  onClickTitle() {
    dispatch({
      type: 'UI_CLICK_TITLE_IN_TASK_LIST',
      id: this.props.taskCategory.id,
    });
  }

  onClickAddButton() {
    dispatch({
      type: 'UI_CLICK_ADD_BUTTON_IN_TASK_LIST',
      taskCategoryId: this.props.taskCategory.id,
    });
  }

  onClickDeleteTaskCategoryButton() {
    if (this.props.taskCategory.tasks.length) {
      promiseConfirm(messages.CONFIRM_DELETE_TASK_CATEGORY).then(() => {
        dispatch({
          type: 'UI_CLICK_DELETE_TASK_CATEGORY_BUTTON_IN_TASK_LIST',
          id: this.props.taskCategory.id,
        });
      }).catch(error => error);
    } else {
      dispatch({
        type: 'UI_CLICK_DELETE_TASK_CATEGORY_BUTTON_IN_TASK_LIST',
        id: this.props.taskCategory.id,
      });
    }
  }

  onKeyDownTaskCategoryInput(event) {
    const keyCode = event.keyCode;
    const shift = event.shiftKey;
    const ctrl = event.ctrlKey || event.metaKey;

    switch (true) {
      case (keyCode === keyCodes.ENTER && !shift && !ctrl):
        this._saveTaskCategory('UI_KEYDOWN_TASK_CATEGORY_INPUT_WITH_ENTER_IN_TASK_LIST');
        break;
      case (keyCode === keyCodes.ESC && !shift && !ctrl):
        this._saveTaskCategory('UI_KEYDOWN_TASK_CATEGORY_INPUT_WITH_ESC_IN_TASK_LIST');
        break;
      default:
        break;
    }
  }

  onBlurTaskCategoryInput() {
    this._saveTaskCategory('UI_BLUR_TASK_CATEGORY_INPUT_IN_TASK_LIST');
  }

  onChangeTaskCategoryInput(event) {
    this.setState({
      value: event.target.value,
    });
  }

  onDragEnterHeader() {
    const taskCategory = this.props.taskCategory;

    this.props.setNewOrder(taskCategory.id, 0);
  }

  onDragEndHeader() {
    this.props.moveTask();
  }

  onDragEnterAddButton() {
    const taskCategory = this.props.taskCategory;

    this.props.setNewOrder(taskCategory.id, taskCategory.tasks.length);
  }

  onDragEndAddButton() {
    this.props.moveTask();
  }

  onDragEnterList() {
    this.props.setNewTaskCategoryOrder(this.props.taskCategory.order);
  }

  onDragEndList() {
    this.props.moveTaskCategory(this.props.taskCategory.id);
  }

  _selectInputValue() {
    this.refs.input.select();
  }

  _saveTaskCategory(type) {
    dispatch({
      type,
      id: this.props.taskCategory.id,
      value: this.state.value,
    });
  }

  _createTaskListItemElement(task) {
    return (
      <TaskListItem
        key={task.id}
        task={task}
        setNewOrder={this.props.setNewOrder}
        moveTask={this.props.moveTask}
      />
    );
  }

  render() {
    const taskCategory = this.props.taskCategory;
    const taskListItemElements = taskCategory.tasks.map(
      (task) => this._createTaskListItemElement(task)
    );

    const titleElement = (this.props.taskCategory.isEditing) ? (
      <div className="list-header-content">
        <h3 className="list-header-text" >
          <input
            autoFocus
            type="text"
            ref="input"
            value={this.state.value}
            onChange={this.onChangeTaskCategoryInput}
            onKeyDown={this.onKeyDownTaskCategoryInput}
            onBlur={this.onBlurTaskCategoryInput}
          />
        </h3>
      </div>
    ) : (
      <div className="list-header-content list-header-content__hovering-show-right-icon">
        <h3
          className="list-header-text cursor-pointer"
          onDragEnter={this.onDragEnterHeader}
          onDragEnd={this.onDragEndHeader}
          onClick={this.onClickTitle}
        >
          {taskCategory.name}
        </h3>
        <div
          className="list-header-icon"
          onClick={this.onClickDeleteTaskCategoryButton}
        >
          <i className="icon">clear</i>
        </div>
      </div>
    );
    return (
      <section
        draggable
        className="list"
        onDragEnter={this.onDragEnterList}
        onDragEnd={this.onDragEndList}
      >
        <header className="list-header">{titleElement}</header>
        <ul>{taskListItemElements}</ul>
        <footer className="list-footer">
          <div
            className="list-footer-content"
            onClick={this.onClickAddButton}
            onDragEnter={this.onDragEnterAddButton}
            onDragEnd={this.onDragEndAddButton}
          >
            <div
              className="list-footer-icon"
            >
              <i className="icon">add</i>
            </div>
            <div className="list-footer-text color-middle-gray cursor-pointer">
            Add task to {this.props.taskCategory.name}
            </div>
          </div>
        </footer>
      </section>
    );
  }
}

TaskList.propTypes = taskListPropTypes;
