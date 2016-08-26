import React, { Component } from 'react';

import { dispatch } from '../../libs/app-dispatcher';
import Scene from './scene';
import SwipableListItem from './swipable-list-item';


const propTypes = {
  taskCategories: React.PropTypes.array.isRequired,
};

export default class TaskCategoriesPage extends Component {
  constructor() {
    super();

    this.onSwipeLeft = this.onSwipeLeft.bind(this);
    this.onSwipeRight = this.onSwipeRight.bind(this);
  }

  componentDidMount() {
    dispatch({ type: 'UI_START_TASK_CATEGORIES_PAGE' });
  }

  onSwipeLeft(props) {
    dispatch({
      type: 'UI_SWIPE_LEFT_LIST_ITEM',
      id: props.task.id,
    });
  }

  onSwipeRight(props, target) {
    dispatch({
      type: 'UI_SWIPE_RIGHT_LIST_ITEM',
      id: props.task.id,
    });
  }

  render() {
    const taskCategories = this.props.taskCategories;
    const taskListElements = taskCategories.concat().reverse().map(taskCategory => (
      <Scene key={taskCategory.id}>
        <ul className="list">
          <li className="list-item">
            <div className="list-item-text">
              {taskCategory.name}
            </div>
          </li>
          {taskCategory.tasks.map((task) => {
            return (
              <SwipableListItem
                key={task.id}
                task={task}
                onSwipeLeft={this.onSwipeLeft}
                onSwipeRight={this.onSwipeRight}
                endPostion={{
                  swipeRight: 'left',
                  swipeLeft: 'remove'
                }}
              >
                <div className="list-item-text">
                  {task.text}
                </div>
              </SwipableListItem>
            );
          })}
        </ul>
      </Scene>
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
