import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import config from '../../config';
import { dispatch } from '../libs/app-dispatcher';
import { pages } from '../constants/constants';
import Header from '../components/header';
import Launcher from '../components/launcher';
import TasksPage from '../components/tasks-page';
import SettingsPage from '../components/settings-page';
import HelpPage from '../components/help-page';


const propTypes = {
  store: React.PropTypes.object.isRequired,
};

export default class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      store: this.props.store,
    };

    this.updateState = this._updateState.bind(this);
  }

  componentDidMount() {
    this.props.store.addChangeListener(this.updateState);
    dispatch({ type: 'UI_START_APP' });
  }

  componentWillUnmount() {
    this.props.store.removeChangeListener(this.updateState);
  }

  _updateState() {
    this.setState({
      store: this.props.store,
    });
  }

  _changeTitle(title) {
    document.title = `${title} | ${config.name}`;
  }

  _createPageElement() {
    const page = this.state.store.getPage();
    const title = this.state.store.getTitle();

    this._changeTitle(title);

    switch (page) {
      case (pages.TASKS):
        let taskCategories = this.state.store.taskState.getTaskCategories();
        return (
          <section key={page} className="page-container">
            <TasksPage page={page} taskCategories={taskCategories} />
          </section>
        );
      case (pages.SETTINGS):
        return (
          <section key={page} className="page-container">
            <SettingsPage page={page} />
          </section>
        );
      case (pages.HELP):
        return (
          <section key={page} className="page-container">
            <HelpPage page={page} />
          </section>
        );
      default:
        return (
          <section key={page} className="page-container">
            <div>404</div>
          </section>
        );
    }
  }

  render() {
    const page = this.state.store.getPage();
    const pageElement = this._createPageElement();

    // Ref _transition.sass
    const transitionOptions = {
      transitionEnterTimeout: 300,
      transitionLeaveTimeout: 300,
    };

    const transitionVariations = {
      fadeInOut: {
        enter: 'fade-in',
        leave: 'fade-out',
      },
      slideInOut: {
        enter: 'slide-in',
        leave: 'slide-out',
      },
      slideUpDown: {
        enter: 'slide-up',
        leave: 'slide-down',
      },
    };

    const position = (page == pages.TASKS) ? 'default' : 'bottom';
    return (
      <div>
        <Header page={page} position={position} />
        <ReactCSSTransitionGroup
          transitionName={transitionVariations.fadeInOut}
          { ...transitionOptions }
        >
          {(
            page === pages.SETTINGS
          ) ? pageElement : null}
        </ReactCSSTransitionGroup>

        <ReactCSSTransitionGroup
          transitionName={transitionVariations.slideInOut}
          { ...transitionOptions }
        >
          {(
            page === pages.HELP
          ) ? pageElement : null}
        </ReactCSSTransitionGroup>

        <ReactCSSTransitionGroup
          transitionName={transitionVariations.slideUpDown}
          { ...transitionOptions }
        >
          {(
            page === pages.TASKS
          ) ? pageElement : null}
        </ReactCSSTransitionGroup>

        <Launcher />
      </div>
    );
  }
}

Container.propTypes = propTypes;
