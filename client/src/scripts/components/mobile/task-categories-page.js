import React, { Component } from 'react';

import { dispatch } from '../../libs/app-dispatcher';

import TaskList from '../desktop/task-list';


const propTypes = {
  taskCategories: React.PropTypes.array.isRequired,
};

export default class TaskCategoriesPage extends Component {
  constructor() {
    super();

    this._touch = {};
    this._touchItem = {};

    this.onTouchStartScene = this.onTouchStartScene.bind(this);
    this.onTouchMoveScene = this.onTouchMoveScene.bind(this);
    this.onTouchEndScene = this.onTouchEndScene.bind(this);
  }
  componentDidMount() {
    dispatch({ type: 'UI_START_TASK_CATEGORIES_PAGE' });
  }

  onTouchStartScene(event) {
    this._touch.start = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  onTouchMoveScene(event) {
    this._touch.end = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
    this._touch.delta = {
      x: this._touch.end.x - this._touch.start.x,
      y: this._touch.end.y - this._touch.start.y,
    };
    event.currentTarget.style.transform = `translateX(${ this._touch.delta.x }px)`;
    const sceneElements = document.querySelectorAll('.scene');
    if (this._touch.delta.x > 0) {
      for (let index = 1; index < sceneElements.length - 1; index++) {
        const sceneElement = sceneElements[index];
        sceneElement.style.display = 'none';
      }
    } else {
      sceneElements.forEach((sceneElement) => {
        sceneElement.style.display = '';
      });
    }
  }

  onTouchEndScene(event) {
    const transitionTime = 200;
    const xTh = 80;
    const target = event.currentTarget;
    if (Math.abs(this._touch.delta.x) > Math.abs(this._touch.delta.y)) {

      if (this._touch.delta.x < 0 && Math.abs(this._touch.delta.x) > xTh) {
        target.style.transform = `translateX(-100%)`;
        setTimeout(() => {
          target.style.transform = `translateX(0)`;
          document.querySelectorAll('.scene').forEach((sceneElement) => {
            sceneElement.style.display = '';
          });
          dispatch({ type: 'UI_SWIPE_LEFT_SCENE' });
        }, transitionTime);

      } else if (this._touch.delta.x > 0 && Math.abs(this._touch.delta.x) > xTh) {
        target.style.transform = `translateX(100%)`;

        setTimeout(() => {
          target.style.transform = `translateX(0)`;
          document.querySelectorAll('.scene').forEach((sceneElement) => {
            sceneElement.style.display = '';
          });
          dispatch({ type: 'UI_SWIPE_RIGHT_SCENE' });
        }, transitionTime);
      } else {
        target.style.transform = `translate(0, 0)`;
      }
    } else {
      target.style.transform = `translate(0, 0)`;
    }
  }

  render() {
    const taskCategories = this.props.taskCategories;
    const taskListElements = taskCategories.concat().reverse().map(taskCategory => (
      <section
        className="scene"
        key={taskCategory.id}
        onTouchStart={this.onTouchStartScene}
        onTouchMove={this.onTouchMoveScene}
        onTouchEnd={this.onTouchEndScene}
      >
        <ul className="list">
          <li className="list-item">
            <div className="list-item-text">
              {taskCategory.name}
            </div>
          </li>
          {taskCategory.tasks.map((task) => {
            return (
              <li
                className="list-item"
                onTouchStart={ (event) => {
                  event.stopPropagation();
                  this._touchItem.start = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY,
                  };
                }}
                onTouchMove={ (event) => {
                  event.stopPropagation();
                  this._touchItem.end = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY,
                  };
                  this._touchItem.delta = {
                    x: this._touchItem.end.x - this._touchItem.start.x,
                    y: this._touchItem.end.y - this._touchItem.start.y,
                  };
                  event.currentTarget.style.transform = `translateX(${ this._touchItem.delta.x }px)`;
                }}
                onTouchEnd={ (event) => {
                  event.stopPropagation();

                  const transitionTime = 200;
                  const xTh = 80;
                  const target = event.currentTarget;
                  if (Math.abs(this._touchItem.delta.x) > Math.abs(this._touchItem.delta.y)) {
                    if (this._touchItem.delta.x < 0 && Math.abs(this._touchItem.delta.x) > xTh) {
                      target.style.transform = `translateX(-100%)`;
                      setTimeout(() => {
                        target.style.transform = `translateX(0)`;
                        document.querySelectorAll('.scene').forEach((sceneElement) => {
                          sceneElement.style.display = '';
                        });
                        dispatch({
                          type: 'UI_SWIPE_LEFT_LIST_ITEM',
                          id: task.id,
                        });
                      }, transitionTime);

                    } else if (this._touchItem.delta.x > 0 && Math.abs(this._touchItem.delta.x) > xTh) {
                      target.style.transform = `translateX(100%)`;

                      setTimeout(() => {
                        target.style.transform = `translateX(0)`;
                        dispatch({
                          type: 'UI_SWIPE_RIGHT_LIST_ITEM',
                          id: task.id,
                        });
                      }, transitionTime);
                    } else {
                      target.style.transform = `translate(0, 0)`;
                    }
                  } else {
                    target.style.transform = `translate(0, 0)`;
                  }
                }}
              >
                <div className="list-item-text">
                  {task.text}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    ));

    return (
      <section className="page page__header tasks-page">
        <section className="page-content">
          <section className="scene-container">
            {taskListElements}
          </section>
        </section>
      </section>
    );
  }
}

TaskCategoriesPage.propTypes = propTypes;
