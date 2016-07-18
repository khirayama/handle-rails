import React, { Component } from 'react';
import classNames from 'classnames';

import { keyCodes } from '../constants/constants';
import { dispatch } from '../libs/app-dispatcher';


const taskListItemPropTypes = {
  task: React.PropTypes.object.isRequired,
  setCurrentOrder: React.PropTypes.func,
  setNewOrder: React.PropTypes.func,
  moveTask: React.PropTypes.func,
  setIsItemDragging: React.PropTypes.func,
};

export default class TaskListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.task.text,
    };

    this.onClickLabel = this.onClickLabel.bind(this);
    this.onClickDoneButton = this.onClickDoneButton.bind(this);
    this.onClickDeleteButton = this.onClickDeleteButton.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onKeyDownInput = this.onKeyDownInput.bind(this);
    this.onBlurInput = this.onBlurInput.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.task.isEditing && (prevState.value === this.state.value)) {
      this._selectInputValue();
    }
  }

  onClickLabel() {
    if (!this.props.task.completed) {
      dispatch({
        type: 'UI_CLICK_LABEL',
        id: this.props.task.id,
      });
    }
  }

  onClickDoneButton() {
    dispatch({
      type: 'UI_CLICK_DONE_BUTTON',
      id: this.props.task.id,
    });
  }

  onClickDeleteButton() {
    dispatch({
      type: 'UI_CLICK_DELETE_BUTTON_IN_TASK_LIST_ITEM',
      id: this.props.task.id,
    });
  }

  onDragStart() {
    const task = this.props.task;

    this.props.setIsItemDragging(true);
    this.props.setCurrentOrder(task.categoryId, task.order);
  }

  onDragEnter() {
    const task = this.props.task;

    this.props.setNewOrder(task.categoryId, task.order);
  }

  onDragEnd() {
    this.props.setIsItemDragging(false);
    this.props.moveTask();
  }

  onChangeInput(event) {
    this.setState({
      value: event.target.value,
    });
  }

  onKeyDownInput(event) {
    const keyCode = event.keyCode;
    const shift = event.shiftKey;
    const ctrl = event.ctrlKey || event.metaKey;

    switch (true) {
      case (keyCode === keyCodes.ENTER && !shift && !ctrl):
        this.save('UI_KEYDOWN_INPUT_WITH_ENTER_IN_TASK_LIST_ITEM');
        break;
      case (keyCode === keyCodes.ENTER && !shift && ctrl):
        dispatch({
          type: 'UI_KEYDOWN_INPUT_WITH_ENTER_AND_CTRL_IN_TASK_LIST_ITEM',
          value: this.state.value,
          id: this.props.task.id,
          categoryId: this.props.task.categoryId,
        });
        break;
      case (keyCode === keyCodes.ESC && !shift && !ctrl):
        this.save('UI_KEYDOWN_INPUT_WITH_ESC_IN_TASK_LIST_ITEM');
        break;
      case (keyCode === keyCodes.TAB && !shift && !ctrl):
        event.preventDefault();
        dispatch({
          type: 'UI_KEYDOWN_INPUT_WITH_TAB_IN_TASK_LIST_ITEM',
          categoryId: this.props.task.categoryId,
          order: this.props.task.order,
        });
        break;
      case (keyCode === keyCodes.TAB && shift && !ctrl):
        event.preventDefault();
        dispatch({
          type: 'UI_KEYDOWN_INPUT_WITH_TAB_AND_SHIFT_IN_TASK_LIST_ITEM',
          categoryId: this.props.task.categoryId,
          order: this.props.task.order,
        });
        break;
      default:
        break;
    }
  }

  onBlurInput() {
    this.save('UI_BLUR_INPUT_IN_TASK_LIST_ITEM');
  }

  save(type) {
    dispatch({
      type: type,
      id: this.props.task.id,
      text: this.state.value,
    });
  }

  _selectInputValue() {
    this.refs.input.select();
  }

  render() {
    const task = this.props.task;
    let itemContent;

    if (task.isEditing) {
      itemContent = (
        <div className="list-item-text">
          <input
            autoFocus
            ref="input"
            placeholder={'Add a task'}
            value={this.state.value}
            onChange={this.onChangeInput}
            onKeyDown={this.onKeyDownInput}
            onBlur={this.onBlurInput}
          />
        </div>
      );
    } else {
      if (task.schedule) {
        const schedule = task.schedule;
        itemContent = (
          <div
            className="list-item-text"
            onClick={this.onClickLabel}
          >
            {task.scheduleText}
            <div className="list-item-note">
              {schedule.year}/{schedule.month}/{schedule.date}({schedule.shortDayName}.)
            </div>
          </div>
        );
      } else {
        itemContent = (
          <div
            className="list-item-text"
            onClick={this.onClickLabel}
          >
            {task.text}
          </div>
        );
      }
    }
    const itemContentProps = {
      draggable: true,
      onDragStart: this.onDragStart,
      onDragEnter: this.onDragEnter,
      onDragEnd: this.onDragEnd,
    };

    return (
      <li
        {...itemContentProps}
        key={task.id}
        className={classNames('list-item', { 'list-item__disabled': task.completed })}
      >
        <div className="list-item-content list-item-content__hovering-show-right-icon">
          <div className="list-item-icon" onClick={this.onClickDoneButton}><i className="icon">done</i></div>
          {itemContent}
          <div className="list-item-icon" onClick={this.onClickDeleteButton}><i className="icon">remove_circle_outline</i></div>
        </div>
      </li>
    );
  }
}

TaskListItem.propTypes = taskListItemPropTypes;
