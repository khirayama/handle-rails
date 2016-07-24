import React, { Component } from 'react';

import { keyCodes } from '../constants/constants';
import LauncherItem from './launcher-item';
import { getLauncherContents } from '../utils/get-launcher-contents';


export default class Launcher extends Component {
  static _filterContents(contents, searchText) {
    const filteredContents = contents.concat();
    const searchWords = searchText.split(' ');

    searchWords.forEach(searchWord => {
      filteredContents.forEach((content, index) => {
        if (content && content.text.toUpperCase().indexOf(searchWord.toUpperCase()) === -1) {
          filteredContents.splice(index, 1, false);
        }
      });
    });

    return filteredContents.filter(el => Boolean(el));
  }

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      contentIndex: 0,
      contents: [],
      filteredContents: [],
      isShowing: false,
    };

    this.onKeyDownInput = this.onKeyDownInput.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.callAction = this._callAction.bind(this);
    this.showLauncher = this._showLauncher.bind(this);
    this.hideLauncher = this._hideLauncher.bind(this);

    getLauncherContents().then((contents) => {
      this.setState({
        contents,
        filteredContents: contents,
      });
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', event => {
      const keyCode = event.keyCode;
      const shift = event.shiftKey;
      const ctrl = event.ctrlKey || event.metaKey;

      switch (true) {
        case (keyCode === keyCodes.K && !shift && ctrl):
          this.showLauncher();
          break;
        default:
          break;
      }
    });
  }

  onKeyDownInput(event) {
    const keyCode = event.keyCode;
    const shift = event.shiftKey;
    const ctrl = event.ctrlKey || event.metaKey;
    let contentIndex;
    let content = [];

    switch (true) {
      case (keyCode === keyCodes.ENTER && !shift && !ctrl):
        content = this.state.filteredContents[this.state.contentIndex];

        this.callAction(content);
        break;
      case (keyCode === keyCodes.UP && !shift && !ctrl):
        event.preventDefault();
        contentIndex = this.state.contentIndex - 1;
        if (contentIndex < 0) {
          contentIndex = this.state.filteredContents.length - 1;
        }
        this.setState({ contentIndex });
        break;
      case (keyCode === keyCodes.DOWN && !shift && !ctrl):
        event.preventDefault();
        contentIndex = this.state.contentIndex + 1;
        if (contentIndex > this.state.filteredContents.length - 1) {
          contentIndex = 0;
        }
        this.setState({ contentIndex });
        break;
      case (keyCode === keyCodes.ESC && !shift && !ctrl):
        this.hideLauncher();
        break;
      default:
        break;
    }
  }

  onChangeInput(event) {
    const value = event.target.value;
    const filteredContents = Launcher._filterContents(this.state.contents, value);

    this.setState({ value, filteredContents });
  }

  _callAction(content) {
    if (this.state.filteredContents.length === 0) {
      return;
    }
    if (content.callback) {
      content.callback();
    }
    this.hideLauncher();
  }

  _showLauncher() {
    this.setState({ isShowing: true });
  }

  _hideLauncher() {
    this.setState({
      isShowing: false,
      value: '',
      filteredContents: this.state.contents,
      contentIndex: 0,
    });
  }

  _stopPropagation(event) {
    event.stopPropagation();
  }

  _createContentItemElement(content, index) {
    const isSelected = (this.state.contentIndex === index);

    return (
      <LauncherItem
        key={`content-${index}`}
        content={content}
        isSelected={isSelected}
        callAction={this.callAction}
      />
    );
  }

  _createNoResultItem() {
    return [(
      <li
        key="launcher-list-item-no-results"
        className="list-item"
      >
        <div className="list-item-text">No results</div>
      </li>
    )];
  }

  render() {
    let contentElements;

    if (this.state.filteredContents.length !== 0) {
      contentElements = this.state.filteredContents.map(
        (content, index) => this._createContentItemElement(content, index)
      );
    } else {
      contentElements = this._createNoResultItem();
    }

    if (this.state.isShowing) {
      return (
        <div
          className="launcher-background"
          onClick={this.hideLauncher}
        >
          <div className="launcher-list-container">
            <section className="list">
              <header className="list-header">
                <div className="list-header-content">
                  <div className="list-header-text" >
                    <input
                      autoFocus
                      placeholder="Search shortcut"
                      type="text"
                      onClick={this._stopPropagation}
                      onKeyDown={this.onKeyDownInput}
                      onChange={this.onChangeInput}
                      value={this.state.value}
                    />
                  </div>
                </div>
              </header>
              <ul>{contentElements}</ul>
            </section>
          </div>
        </div>
      );
    }
    return null;
  }
}
