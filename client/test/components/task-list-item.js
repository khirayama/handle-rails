import assert from 'power-assert';
import { jsdom } from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

import TaskListItem from '../../src/scripts/components/task-list-item';


global.document = jsdom('<html><<body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;

const taskListItemElement = ReactTestUtils.renderIntoDocument(React.createElement(TaskListItem, {
  task: {
    id: 'dummy-id',
    text: 'AAA',
    completed: false,
  },
  otherCategories: [],
}));

describe('TaskListItem', () => {
  it('click done button', () => {
    let doneButton = ReactDOM.findDOMNode(taskListItemElement).querySelector('.done-button');
    // ReactTestUtils.Simulate.click(doneButton);
  });
});

