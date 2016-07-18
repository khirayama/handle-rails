// mock localstorage
const localStorage = global.localStorage || {
  setItem: () => {
  },
  getItem: () => {
  },
};

function _o2a(obj) {
  const arr = [];

  const keys = Object.keys(obj);
  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    const key = keys[keyIndex];

    if (!key) {
      break;
    }
    arr.push(Object.assign({}, obj[key]));
  }
  return arr;
}

export default class MicroResource {
  constructor(options = { localStorage: true }) {
    // this._localStorage = options.localStorage;
    this._localStorage = false;
    this._data = (this._localStorage) ? this._load() : {};
    this._filteredData = [];
    this._filtering = false;
    this.defaults = {};
  }

  // CRUD method
  create(entity) {
    const now = new Date();
    const id = (+now + Math.floor(Math.random() * 999999)).toString(36);

    this._data[id] = Object.assign({}, {
      id,
      createdAt: now,
      updatedAt: now,
    }, this.defaults, entity);
    if (this._localStorage) this._save();

    return Object.assign({}, this._data[id]);
  }

  update(id, updates) {
    const now = new Date();
    this._data[id] = Object.assign({ updatedAt: now }, this._data[id], updates);
    if (this._localStorage) this._save();

    return Object.assign({}, this._data[id]);
  }

  destroy(id) {
    delete this._data[id];
    if (this._localStorage) this._save();
  }

  drop() {
    this._data = {};
    this._filteredData = [];
    this._filtering = false;
    if (this._localStorage) this._save();
  }

  get(id) {
    if (id) return this._data[id];
    this._filtering = false;

    return _o2a(this._filteredData);
  }

  first() {
    this._filtering = false;

    const data = _o2a(this._filteredData);
    if (data.length !== 0) {
      return data[0];
    }
    return null;
  }

  all() {
    return this._data;
  }

  _save() {
    const key = this.constructor.name;

    localStorage.setItem(key, JSON.stringify(this._data));
  }

  _load() {
    const key = this.constructor.name;
    const value = localStorage.getItem(key);

    return (value) ? JSON.parse(value) : {};
  }

  where(statement, except) {
    if (!this._filtering) {
      this._filtering = true;
      this._filteredData = _o2a(this._data);
    }

    const data = [];
    const ids = Object.keys(this._filteredData);
    for (let idIndex = 0; idIndex < ids.length; idIndex++) {
      const id = ids[idIndex];
      if (!id) {
        break;
      }
      const _data = this._filteredData[id];

      const keys = Object.keys(statement);
      for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        const key = keys[keyIndex];
        if (!key) {
          break;
        }
        const value = statement[key];
        if (except) {
          if (_data[key] !== value) data.push(_data);
        } else {
          if (_data[key] === value) data.push(_data);
        }
      }
    }
    this._filteredData = data;

    return this;
  }

  order(key, reverse = false) {
    if (!this._filtering) {
      this._filtering = true;
      this._filteredData = _o2a(this._data);
    }

    this._filteredData.sort((itemA, itemB) => {
      const valueX = itemA[key];
      const valueY = itemB[key];

      if (reverse) {
        if (valueX > valueY) return -1;
        if (valueX < valueY) return 1;
        return 0;
      }
      if (valueX > valueY) return 1;
      if (valueX < valueY) return -1;
      return 0;
    });

    return this;
  }

  limit(num) {
    if (!this._filtering) {
      this._filtering = true;
      this._filteredData = _o2a(this._data);
    }

    const data = [];
    for (let index = 0; index < num; index++) {
      data.push(this._filteredData[index]);
    }
    this._filteredData = data;

    return this;
  }
}
