import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import config from '../../config';
import { pages } from '../constants/constants';
import Header from '../components/header';
import Launcher from '../components/launcher';
import TasksPage from '../components/tasks-page';
import SettingsPage from '../components/settings-page';
import HelpPage from '../components/help-page';
import { getLauncherContents } from '../utils/get-launcher-contents';


const propTypes = {
  appStore: React.PropTypes.object.isRequired,
};

export default class ManageApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appStore: this.props.appStore,
    };

    this.updateState = this._updateState.bind(this);
  }

  componentDidMount() {
    this.props.appStore.addChangeListener(this.updateState);
  }

  componentWillUnmount() {
    this.props.appStore.removeChangeListener(this.updateState);
  }

  _updateState() {
    this.setState({
      appStore: this.props.appStore,
    });
  }

  _changeTitle(title) {
    document.title = `${title} | ${config.name}`;
  }

  _createPageElement() {
    const page = this.state.appStore.getPage();
    const title = this.state.appStore.getTitle();

    let tasks = [];

    this._changeTitle(title);

    switch (page) {
      case (pages.TASKS):
        tasks = this.state.appStore.taskStore.getTasks();

        return (
          <section key={page} className="page-container">
            <Header page={page} />
            <TasksPage page={page} tasks={tasks} />
          </section>
        );
      case (pages.SETTINGS):
        return (
          <section key={page} className="page-container">
            <Header page={page} position="bottom" />
            <SettingsPage page={page} />
          </section>
        );
      case (pages.HELP):
        return (
          <section key={page} className="page-container">
            <Header page={page} position="bottom" />
            <HelpPage page={page} />
          </section>
        );
      default:
        return (
          <section key={page} className="page-container">
            <Header page={page} position="bottom" />
            <div>404</div>
          </section>
        );
    }
  }

  render() {
    const page = this.state.appStore.getPage();
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

    return (
      <div>
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

        <Launcher
          contents={getLauncherContents()}
        />
      </div>
    );
  }
}

ManageApp.propTypes = propTypes;
