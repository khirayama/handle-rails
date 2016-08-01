import React, { Component } from 'react';

import { dispatch } from '../../libs/app-dispatcher';

import TaskList from '../desktop/task-list';


const propTypes = {
  taskCategories: React.PropTypes.array.isRequired,
};

export default class TaskCategoriesPage extends Component {
  componentDidMount() {
    dispatch({ type: 'UI_START_TASK_CATEGORIES_PAGE' });
  }

  render() {
    const taskCategories = this.props.taskCategories;
    const taskListElements = taskCategories.map(taskCategory => (
      <section
        className="scene"
        key={taskCategory.id}
      >
        <TaskList
          taskCategory={taskCategory}
        />
      </section>
    ));

    return (
      <section className="page page__header tasks-page">
        <section className="page-content">
          <section className="scene-container">
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
