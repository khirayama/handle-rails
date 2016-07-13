import { keyCodes } from '../constants/constants';


function stringToElement(template) {
  const container = document.createElement('div');

  container.innerHTML = template;

  return container;
}


export class ConfirmDialog {
  constructor(message, resolve, reject) {
    this._resolve = resolve;
    this._reject = reject;
    this._message = message;
    this._isAccepted = true;

    this._container = document.querySelector('body');

    this._render();
  }

  componentDidUpdate() {
    this._interruptInput.focus();
  }

  _cacheElements() {
    this._background = this._element.querySelector('.confirm-dialog-background');
    this._cancelButton = this._element.querySelector('.confirm-dialog-cancel-button');
    this._acceptButton = this._element.querySelector('.confirm-dialog-accept-button');
    this._interruptInput = this._element.querySelector('.confirm-dialog-interrupt-input');
  }

  _setEventHandlers() {
    this._cancelButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this._cancel();
      this._hide();
    });

    this._background.addEventListener('click', (event) => {
      event.stopPropagation();
      this._cancel();
      this._hide();
    });

    this._acceptButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this._accept();
      this._hide();
    });

    // stop keybord input
    this._interruptInput.addEventListener('keydown', this._stopPropagation);
    this._interruptInput.addEventListener('keypress', this._stopPropagation);

    this._interruptInput.addEventListener('keyup', (event) => {
      event.stopPropagation();
      const keyCode = event.keyCode;
      const shift = event.shiftKey;
      const ctrl = event.ctrlKey || event.metaKey;

      switch (true) {
        case (keyCode === keyCodes.ENTER && !shift && !ctrl):
          if (this._isAccepted) {
            this._accept();
          } else {
            this._cancel();
          }
          this._hide();
          break;
        case (keyCode === keyCodes.ESC && !shift && !ctrl):
          this._cancel();
          this._hide();
          break;
        case (keyCode === keyCodes.LEFT && !shift && !ctrl):
          this._toggle();
          this._render();
          break;
        case (keyCode === keyCodes.RIGHT && !shift && !ctrl):
          this._toggle();
          this._render();
          break;
        default:
          break;
      }
    });
  }

  _toggle() {
    this._isAccepted = !this._isAccepted;
  }

  _cancel() {
    this._reject();
  }

  _accept() {
    this._resolve();
  }

  _hide() {
    this._element.parentNode.removeChild(this._element);
  }

  _stopPropagation(event) {
    event.stopPropagation();
  }

  _template(message, isAccepted) {
    let cancelButtonClassName = '';
    let acceptButtonClassName = '';

    if (isAccepted) {
      acceptButtonClassName = 'confirm-dialog-button__selected';
    } else {
      cancelButtonClassName = 'confirm-dialog-button__selected';
    }

    return (`
      <div class="confirm-dialog-background">
        <input class="confirm-dialog-interrupt-input" type="text" />
        <div class="confirm-dialog">
          <div class="confirm-dialog-message">${message}</div>
          <div class="confirm-dialog-buttons-container">
            <div
              class="confirm-dialog-button confirm-dialog-cancel-button ${cancelButtonClassName}"
            >
              Cancel
            </div>
            <div
              class="confirm-dialog-button confirm-dialog-accept-button ${acceptButtonClassName}"
            >
              OK
            </div>
          </div>
        </div>
      </div>
    `);
  }

  _render() {
    if (this._element) {
      this._element.parentNode.removeChild(this._element);
    }

    const template = this._template(this._message, this._isAccepted);
    this._element = stringToElement(template);
    this._cacheElements();
    this._setEventHandlers();
    this._container.appendChild(this._element);
    this.componentDidUpdate();
  }
}

export default function promiseConfirm(message) {
  return new Promise((resolve, reject) => new ConfirmDialog(message, resolve, reject));
}
