import React, { Component } from 'react';
import classNames from 'classnames';

import config from '../../../config';
import { dispatch } from '../../libs/app-dispatcher';
import transitionEventHandler from '../common/helpers/transition-event-handler';


export default function Header(props) {
  if (props.position == 'none') {
    return null;
  } else {
    let href = props.href || '/';

    return (
      <header
        key="header"
        className={classNames('app-header', { 'app-header__bottom': (props.position === 'bottom') })}
      >
      <div className="header-button-container"></div>
      <h1 className="app-title"><span>{config.name}</span></h1>
      <div className="header-button-container">
      <a className="header-button" href={href} onClick={ transitionEventHandler }><i className="icon">settings</i></a>
      </div>
      </header>
    );
  }
}
