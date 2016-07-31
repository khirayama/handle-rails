import React, { Component } from 'react';
import classNames from 'classnames';

import config from '../../../config';
import { pages } from '../../constants/constants';
import { dispatch } from '../../libs/app-dispatcher';


const propTypes = {
  page: React.PropTypes.string.isRequired,
  position: React.PropTypes.string,
};

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.onClickSettings = this.onClickSettings.bind(this);
  }

  onClickSettings() {
    const HOME = pages.TASK_CATEGORIES;
    let leftHref = HOME;

    if (this.props.page === HOME) {
      leftHref = pages.SETTINGS;
    }

    dispatch({
      type: 'UI_CLICK_SETTINGS_BUTTON_IN_HEADER',
      link: leftHref,
    });
  }

  render() {
    return (
      <header
        key="header"
        className={classNames('app-header', { 'app-header__bottom': (this.props.position === 'bottom') })}
      >
        <div className="header-button-container"></div>
        <h1 className="app-title"><span>{config.name}</span></h1>
        <div className="header-button-container">
          <div className="header-button" onClick={this.onClickSettings}><i className="icon">settings</i></div>
        </div>
      </header>
    );
  }
}

Header.propTypes = propTypes;
