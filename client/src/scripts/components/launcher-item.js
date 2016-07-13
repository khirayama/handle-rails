import React, { Component } from 'react';
import classNames from 'classnames';


const LauncherListItemPropTypes = {
  content: React.PropTypes.object.isRequired,
  isSelected: React.PropTypes.bool.isRequired,
  callAction: React.PropTypes.func.isRequired,
};

export default class LauncherListItem extends Component {
  constructor(props) {
    super(props);

    this.onClickItem = this.onClickItem.bind(this);
  }

  onClickItem() {
    this.props.callAction(this.props.content);
  }

  render() {
    return (
      <li
        className={classNames('list-item', { 'list-item__selected': this.props.isSelected })}
        onClick={this.onClickItem}
      >
        <div className="list-item-text">
          {this.props.content.text}
        </div>
      </li>
    );
  }
}

LauncherListItem.propTypes = LauncherListItemPropTypes;
