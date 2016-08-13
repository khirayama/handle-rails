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

  _createPageElement(pageInformation, state) {
    switch (pageInformation.name) {
      case (pages.LANDING):
        return (
          <section className="page-container">
            <LandingPage {...pageInformation} {...state} />
          </section>
        );
      case (pages.TASK_CATEGORIES):
        return (
          <section className="page-container">
            <TaskCategoriesPage {...pageInformation} {...state} />
          </section>
        );
      case (pages.SETTINGS):
        return (
          <section className="page-container">
            <SettingsPage {...pageInformation} {...state} />
          </section>
        );
      case (pages.HELP):
        return (
          <section className="page-container">
            <HelpPage {...pageInformation} {...state} />
          </section>
        );
      default:
        if (pageInformation.name) {
          return (
            <section className="page-container">
              <section className="page not-found-page">
                <section className="page-content">
                  <h1>Not found contents...</h1>
                </section>
              </section>
            </section>
          );
        } else {
          return (
            <section className="page-container">
              <section className="page not-found-page">
                <section className="page-content">
                  <h1>Loading...</h1>
                </section>
              </section>
            </section>
          );
        }
    }
  }

  render() {
    const pageInformation = this.state.appStore.getPageInformation();
    const state = this.state.appStore.getState();

    const pageElement = this._createPageElement(pageInformation, state);
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

    this._changeTitle(pageInformation.meta.title);
    return (
      <div>
        <Header {...pageInformation.styles.header} />
        <ReactCSSTransitionGroup
        transitionName={transitionVariations.fadeInOut.names}
        { ...transitionVariations.fadeInOut.options }
        >
          {( pageInformation.styles.transition === 'fadeInOut') ? pageElement : null}
        </ReactCSSTransitionGroup>

        <ReactCSSTransitionGroup
        transitionName={transitionVariations.slideInOut.names}
        { ...transitionVariations.slideInOut.options }
        >
          {( pageInformation.styles.transition === 'slideInOut') ? pageElement : null}
        </ReactCSSTransitionGroup>

        <ReactCSSTransitionGroup
        transitionName={transitionVariations.slideUpDown.names}
        { ...transitionVariations.slideUpDown.options }
        >
          {( pageInformation.styles.transition === 'slideUpDown') ? pageElement : null}
        </ReactCSSTransitionGroup>

        {( !pageInformation.styles.transition ) ? pageElement : null}

        <Launcher />
      </div>
    );
  }
}

App.propTypes = propTypes;
