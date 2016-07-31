import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import config from '../../../config';
import { dispatch } from '../../libs/app-dispatcher';
import { pages } from '../../constants/constants';

import Header from './header';
import TaskCategoriesPage from '../task-categories-page';
import SettingsPage from '../settings-page';
import HelpPage from '../help-page';


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
    const page = this.state.appStore.getPage();
    const props = (this.state.appStore.pageStore.props) ? this.state.appStore.pageStore.props() : {};

    switch (page) {
      case (pages.TASK_CATEGORIES):
        return (
          <section key={page} className="page-container">
            <TaskCategoriesPage page={page} {...props} />
          </section>
        );
      case (pages.SETTINGS):
        return (
          <section key={page} className="page-container">
            <SettingsPage page={page} {...props} />
          </section>
        );
      case (pages.HELP):
        return (
          <section key={page} className="page-container">
            <HelpPage page={page} {...props} />
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

    document.querySelector('html').classList.add('mobile-ui');
    return (
      <div>
        <Header page={page} position={styles.header.position} />
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
      </div>
    );
  }
}

App.propTypes = propTypes;
