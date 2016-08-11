import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import config from '../../../config';
import { dispatch } from '../../libs/app-dispatcher';
import { pages } from '../../constants/constants';

import Header from './header';
import Launcher from './launcher';
import TaskCategoriesPage from './task-categories-page';

import LandingPage from '../common/landing-page';
import SettingsPage from '../common/settings-page';
import HelpPage from '../common/help-page';


const propTypes = {
  appStore: React.PropTypes.object.isRequired,
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appStore: this.props.appStore,
    };

    this.updateState = this._updateState.bind(this);
  }

  componentDidMount() {
    this.props.appStore.addChangeListener(this.updateState);
    dispatch({
      type: 'UI_START_APP',
      pathname: location.pathname,
    });
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
    const appProps = {
      page: this.state.appStore.getPage(),
      isLoggedIn: this.state.appStore.isLoggedIn(),
    };
    const props = (this.state.appStore.pageStore.props) ? this.state.appStore.pageStore.props() : {};

    switch (appProps.page) {
      case (pages.LANDING):
        return (
          <section key={appProps.page} className="page-container">
            <LandingPage {...appProps} {...props} />
          </section>
        );
      case (pages.TASK_CATEGORIES):
        return (
          <section key={appProps.page} className="page-container">
            <TaskCategoriesPage {...appProps} {...props} />
          </section>
        );
      case (pages.SETTINGS):
        return (
          <section key={appProps.page} className="page-container">
            <SettingsPage {...appProps} {...props} />
          </section>
        );
      case (pages.HELP):
        return (
          <section key={appProps.page} className="page-container">
            <HelpPage {...appProps} {...props} />
          </section>
        );
      default:
        return (
          <section key={appProps.page} className="page-container">
            <div>404</div>
          </section>
        );
    }
  }

  render() {
    if (this.state.appStore.pageStore == null) {
      return null;
    }
    const title = this.state.appStore.pageStore.meta.title;
    this._changeTitle(title);

    const page = this.state.appStore.getPage();
    const pageElement = this._createPageElement();
    const styles = this.state.appStore.pageStore.styles;

    // Ref _transition.sass
    const transitionVariations = {
      fadeInOut: {
        names: {
          enter: 'fade-in',
          leave: 'fade-out',
        },
        options: {
          transitionEnterTimeout: 300,
          transitionLeaveTimeout: 300,
        }
      },
      slideInOut: {
        names: {
          enter: 'slide-in',
          leave: 'slide-out',
        },
        options: {
          transitionEnterTimeout: 300,
          transitionLeaveTimeout: 300,
        }
      },
      slideUpDown: {
        names: {
          enter: 'slide-up',
          leave: 'slide-down',
        },
        options: {
          transitionEnterTimeout: 300,
          transitionLeaveTimeout: 300,
        }
      },
    };

    return (
      <div>
        <Header page={page} {...styles.header} />
        <ReactCSSTransitionGroup
        transitionName={transitionVariations.fadeInOut.names}
        { ...transitionVariations.fadeInOut.options }
        >
          {( styles.transition === 'fadeInOut') ? pageElement : null}
        </ReactCSSTransitionGroup>

        <ReactCSSTransitionGroup
        transitionName={transitionVariations.slideInOut.names}
        { ...transitionVariations.slideInOut.options }
        >
          {( styles.transition === 'slideInOut') ? pageElement : null}
        </ReactCSSTransitionGroup>

        <ReactCSSTransitionGroup
        transitionName={transitionVariations.slideUpDown.names}
        { ...transitionVariations.slideUpDown.options }
        >
          {( styles.transition === 'slideUpDown') ? pageElement : null}
        </ReactCSSTransitionGroup>

        <Launcher />
      </div>
    );
  }
}

App.propTypes = propTypes;
