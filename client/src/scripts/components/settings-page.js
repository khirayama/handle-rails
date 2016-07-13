import React from 'react';

import config from '../../config';
import { pages } from '../constants/constants';
import { dispatch } from '../libs/app-dispatcher';
import PageBackButton from '../components/page-back-button';


export default function SettingsPage() {
  return (
    <section className="page settings-page">
      <section className="page-content">
        <div className="page-back-button-container">
          <PageBackButton icon text="close" />
        </div>
        <div className="setting-list-container">
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
          <ul className="list">
          <li
            className="list-item"
            onClick={
              () => {
                dispatch({
                  type: 'UI_CLICK_HELP_LINK_IN_SETTINGS_PAGE',
                  link: pages.HELP
                });
              }
            }>
              <div className="list-item-text">Help</div>
            </li>
            <li className="list-item">
              <div className="list-item-text">Policy</div>
            </li>
          </ul>
          <section className="list">
            <ul>
              <li className="list-item">
                <div className="list-item-text">Sign Out</div>
              </li>
              <li className="list-item">
                <div className="list-item-text">Delete account</div>
              </li>
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
