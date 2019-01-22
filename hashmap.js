'use strict';

class HashMap {
  constructor() {
    this.length = 0;
    this.array = [];
    this.capacity = 10;
    this.deleted = 0;
  }

  set(key, value) {
    const loadRatio = (this.length + this.deleted + 1) / this.capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this.capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    this.array[index] = {
      key,
      value,
      deleted: false
    };
    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this.array[index];
    if (slot === undefined) {
      throw new Error('Key was not found');
    }
    slot.deleted = true;
    this.length--;
    this.deleted++;
  }

  find(key) {
    const index = this._findSlot(key);
    if (this.array[index] === undefined) {
      throw new Error('Key does not exist');
    }
    return this.array[index].value;
  }

  _resize(size) {
    const oldSlots = this.array;
    this.capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this.deleted = 0;
    this.array = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }

  _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      console.log(hash);
      hash = hash & hash;
    }
    return hash >>> 0;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this.capacity;

    for (let i = start; i < start + this.capacity; i++) {
      const index = i % this.capacity;
      const slot = this.array[index];
      if (slot === undefined || (slot.key == key && !slot.deleted)) {
        return index;
      }
    }
  }
}

HashMap.MAX_LOAD_RATIO = 0.5;
HashMap.SIZE_RATIO = 3;

function main() {
  const myHash = new HashMap();
  console.log(myHash._hashString('James'));
  console.log('a'.charCodeAt(0));
  console.log('Done');
}

main();