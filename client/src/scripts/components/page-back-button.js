import React from 'react';

import { dispatch } from '../libs/app-dispatcher';


const PageBackButtonPropTypes = {
  icon: React.PropTypes.bool,
  text: React.PropTypes.string,
};

export default function PageBackButton(props) {
  let contentElement = <i className="icon">arrow_back</i>;
  if (props.icon && props.text) {
    contentElement = <i className="icon">{ props.text }</i>;
  } else if (props.text) {
    contentElement = props.text;
  }
  const backPage = () => {
    dispatch({
      type: 'UI_CLICK_PAGE_BACK_BUTTON_IN_PAGE_BACK_BUTTON',
    });
  };
  return (
    <div
      className="page-back-button"
      onClick={backPage}
    >
      { contentElement }
    </div>
  );
}

PageBackButton.propTypes = PageBackButtonPropTypes;
