import React, { Component } from 'react';

import { dispatch } from '../../libs/app-dispatcher';


export default class Scene extends Component {
  constructor() {
    super();

    this._touch = {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      delta: { x: 0, y: 0 },
    };

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  onTouchStart(event) {
    this._touch.start = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  onTouchMove(event) {
    this._touch.end = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
    this._touch.delta = {
      x: this._touch.end.x - this._touch.start.x,
      y: this._touch.end.y - this._touch.start.y,
    };
    event.currentTarget.style.transform = `translateX(${ this._touch.delta.x }px)`;

    const sceneElements = document.querySelectorAll('.scene');
    if (this._touch.delta.x > 0) {
      for (let index = 1; index < sceneElements.length - 1; index++) {
        const sceneElement = sceneElements[index];
        sceneElement.style.display = 'none';
      }
    } else {
      sceneElements.forEach((sceneElement) => {
        sceneElement.style.display = '';
      });
    }
  }

  onTouchEnd(event) {
    const transitionTime = 200;
    const xTh = 80;
    const target = event.currentTarget;

    if (Math.abs(this._touch.delta.x) > Math.abs(this._touch.delta.y)) {

      if (this._touch.delta.x < 0 && Math.abs(this._touch.delta.x) > xTh) {
        target.style.transition = `transform ${transitionTime}ms ease-out`;
        target.style.transform = `translateX(-100%)`;
        setTimeout(() => {
          document.querySelectorAll('.scene').forEach((sceneElement) => {
            sceneElement.style.display = '';
          });
          dispatch({ type: 'UI_SWIPE_LEFT_SCENE' });
          target.style.transition = '';
          target.style.transform = `translateX(0)`;
        }, transitionTime);

      } else if (this._touch.delta.x > 0 && Math.abs(this._touch.delta.x) > xTh) {
        target.style.transition = `transform ${transitionTime}ms ease-out`;
        target.style.transform = `translateX(100%)`;

        setTimeout(() => {
          document.querySelectorAll('.scene').forEach((sceneElement) => {
            sceneElement.style.display = '';
          });
          dispatch({ type: 'UI_SWIPE_RIGHT_SCENE' });
          target.style.transition = '';
          target.style.transform = `translateX(0)`;
        }, transitionTime);
      } else {
        target.style.transition = `transform ${transitionTime}ms ease-out`;
        target.style.transform = `translate(0, 0)`;
        setTimeout(() => {
          target.style.transition = '';
        }, transitionTime);
      }
    } else {
      target.style.transform = `translate(0, 0)`;
    }

    this._touch = {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      delta: { x: 0, y: 0 },
    };
  }

  render() {
    return (
      <section
        className="scene"
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
      {this.props.children}
      </section>
    );
  }
}
