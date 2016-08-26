import React, { Component } from 'react';


const MAX_SLIDE_WIDTH = 44;

export default class SwipableListItem extends Component {
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
    event.stopPropagation();
    this._touch.start = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  onTouchMove(event) {
    event.stopPropagation();
    this._touch.end = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
    this._touch.delta = {
      x: this._touch.end.x - this._touch.start.x,
      y: this._touch.end.y - this._touch.start.y,
    };

    if (this._touch.delta.x > MAX_SLIDE_WIDTH) {
      event.currentTarget.style.transform = `translateX(${MAX_SLIDE_WIDTH}px)`;
    } else if (this._touch.delta.x < -1 * MAX_SLIDE_WIDTH) {
      event.currentTarget.style.transform = `translateX(-${MAX_SLIDE_WIDTH}px)`;
    } else {
      event.currentTarget.style.transform = `translateX(${ this._touch.delta.x }px)`;
    }
  }

  onTouchEnd(event) {
    event.stopPropagation();

    const transitionTime = 200;
    const xTh = 80;
    const target = event.currentTarget;

    if (Math.abs(this._touch.delta.x) > Math.abs(this._touch.delta.y)) {
      if (this._touch.delta.x < 0 && Math.abs(this._touch.delta.x) > xTh) {
        if (this.props.endPostion.swipeLeft) {
          switch (this.props.endPostion.swipeLeft) {
            case 'left':
              target.style.transform = `translateX(0)`;
              setTimeout(() => {
                if (this.props.onSwipeLeft) {
                  this.props.onSwipeLeft(this.props);
                }
              }, transitionTime);
              break;
            case 'right':
              target.style.transform = `translateX(100%)`;
              setTimeout(() => {
                if (this.props.onSwipeLeft) {
                  this.props.onSwipeLeft(this.props);
                }
              }, transitionTime);
              break;
            case 'remove':
              target.style.transform = `translateX(-100%)`;
              target.style.display = 'block';
              target.style.height = `${target.getBoundingClientRect().height}px`;
              setTimeout(() => {
                target.style.height = '0px';
                target.style.border = 'none';
                setTimeout(() => {
                  if (this.props.onSwipeLeft) {
                    this.props.onSwipeLeft(this.props);
                  }
                }, transitionTime);
              }, transitionTime);
              break;
          }
        }
      } else if (this._touch.delta.x > 0 && Math.abs(this._touch.delta.x) > xTh) {
        if (this.props.endPostion.swipeRight) {
          switch (this.props.endPostion.swipeRight) {
            case 'left':
              target.style.transform = `translateX(0)`;
              setTimeout(() => {
                if (this.props.onSwipeRight) {
                  this.props.onSwipeRight(this.props, target);
                }
              }, transitionTime);
              break;
            case 'right':
              target.style.transform = `translateX(100%)`;
              setTimeout(() => {
                if (this.props.onSwipeRight) {
                  this.props.onSwipeRight(this.props, target);
                }
              }, transitionTime);
              break;
            case 'remove':
              target.style.transform = `translateX(100%)`;
              target.style.display = 'block';
              target.style.height = `${target.getBoundingClientRect().height}px`;
              setTimeout(() => {
                target.style.height = '0px';
                target.style.border = 'none';
                setTimeout(() => {
                  if (this.props.swipeLeft) {
                    this.props.onSwipeLeft(this.props);
                  }
                }, transitionTime);
              }, transitionTime);
              break;
          }
        }
      } else {
        target.style.transform = `translate(0, 0)`;
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
      <li
        className={this.props.listItemClassName}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
        {this.props.children}
      </li>
    );
  }
}
