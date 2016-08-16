import React from 'react';

import config from '../../../config';
import { pages } from '../../constants/constants';
import { dispatch } from '../../libs/app-dispatcher';
import PageBackButton from './page-back-button';
import transitionEventHandler from '../common/helpers/transition-event-handler';


export default function SettingsPage(props) {
  return (
    <section className="page settings-page">
      <section className="page-content">
        <div className="page-back-button-container">
          <PageBackButton icon text="close" />
        </div>
        <div className="setting-list-container">
          {
            (props.currentUserInformation !== null) ? (
              <section className="list">
                <header className="list-header">
                  <div className="list-header-content">
                    <h3 className="list-header-text" >Settings</h3>
                  </div>
                </header>
                <ul>
                  <li className="list-item">
                    <div className="list-item-text">Extract schedule</div>
                  </li>
                  <li className="list-item">
                    <div className="list-item-text">Clear all data</div>
                  </li>
                </ul>
              </section>
            ) : null
          }
          <ul className="list">
            <li className="list-item">
              <a href="/help" className="list-item-link" onClick={transitionEventHandler}>Help</a>
            </li>
            <li className="list-item">
              <div className="list-item-text">Policy</div>
            </li>
          </ul>
          <section className="list">
            <ul>
              {
                (props.currentUserInformation !== null) ? (
                  <li className="list-item">
                    <a href="/api/v1/logout" className="list-item-link">Sign out</a>
                  </li>
                ) : null
              }
              {
                (props.currentUserInformation !== null) ? (
                  <li className="list-item">
                    <div className="list-item-text">Delete account</div>
                  </li>
                ) : null
              }
              {
                (!props.currentUserInformation !== null) ? (
                  <li className="list-item">
                    <a href="/api/v1/auth/twitter" className="list-item-link">Sign in with Twitter</a>
                  </li>
                ) : null
              }
            </ul>
            <footer className="list-footer">
              <div className="list-footer-content">
                <div className="list-footer-text">
                  <small>2015 - <i className="icon">copyright</i> {config.name}</small>
                </div>
              </div>
            </footer>
          </section>
        </div>
      </section>
    </section>
  );
}
