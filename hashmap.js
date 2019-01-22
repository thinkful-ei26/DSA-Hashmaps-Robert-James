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
    //console.log("Here, the cap: ", this.capacity);
    //console.log("Here, the length: ", this.length);
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
      //throw new Error('Key does not exist');
      return undefined;
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
      // console.log(hash);
      hash = hash & hash;
    }
    return hash >>> 0;
  }

  _findSlot(key) {
    const hash = this._hashString(key);
    const start = hash % this.capacity;

    for (let i = start; i < start + this.capacity; i++) {
      const index = i % this.capacity;
      const slot = this.array[index];
      if (slot === undefined || (slot.key == key && !slot.deleted)) {
        return index;
      }
    }
  }
  log() {
    let show = '';
    for (let i = 0; i < this.capacity; i++) {
      if (this.array[i] !== undefined) {
        show += `key: ${this.array[i].key},  value: ${this.array[i].value}. \n`;
      }
    }
    console.log(show);
    return;
  }

}

HashMap.MAX_LOAD_RATIO = 0.5;
HashMap.SIZE_RATIO = 3;

function main() {
  
  let anaHash = new HashMap(); 

  function anagram(array) {
    
    //input: ['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race']
    //output: [['east', 'teas', 'eats'], ['cars', 'arcs'], ['acre', 'race']]
    /*
      loop through our input,
      each value through our loop is going to be a word which will be split
      sort that word aphabetically
      hash that alphabatized word
          if undefined we create a new array at that hash with value of east(unsorted word)
          if it is not undefined, we push our original word into that array
      'east' => 'e', 'a', 's', 't' => sort and joined into aest => hashed

    */
    let megaArr = [];

    for(let i = 0; i < array.length; i++) {
      let splitWord = array[i].split('');
      let alphaWord = splitWord.sort();
      // console.log('ALPHA:  ', alphaWord);
      let newWord = alphaWord.join('');
      // console.log('New Word:  ', newWord);
      if(anaHash.find(newWord) === undefined) {
        anaHash.set(newWord, [array[i]]);
        megaArr.push(newWord);
      } else {
        anaHash.set(newWord, [...anaHash.find(newWord), array[i]]);
      }
    }
    let finalArr = [];
    // console.log(megaArr);
    for(let i = 0; i < megaArr.length; i++) {
      finalArr.push(anaHash.find(megaArr[i]));
    }

    return finalArr;
  }

  console.log(anagram(['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race']));
  // anaHash.log();

  // function palindrome(string) {
  //input is a string to test
  //   ==>>    north ! pal  orthn ! rthon ! ... !
  //   to be true -- each letter  %2 except the middle letter 
  /*   r x4 
   ax2
   cx2
    r a eeeeeee eeeeeeqeeeee eee r |c| r c a  r  q
             r c a e  a c r
if we loop once thru the string
each letter we say is this letter in the hashmap?
      if it is count ++ +1 to the letters' count ??
      else if not, add it to the hashmap @ count of 1
finish the loop:
let middleLetter = 0;
go thru hashTable=> if (letter%2===0){continue thru the table}
else if letter %2 ===1  middleLetter ++;
      if(middleLetter > 1) return false;
      return true;
if all our hashtable has count %2, then we have a palindrome-able letter set.
except 1 letter gets a pass, 
if we hit a %2!= 0 return false(unless it's our middle letter?)
  */
  //   hannahah    h x2  a x2 n x2  annhha
  // string length is odd there's a middle letter x1
  // string length is even then there's no middle letter x1 all letters should be %2
  //  abc cba 
  //output is true or false for if it is a palindrome
  //   for (let i = 0; i < string.length; i++) {
  //     let thisLetter = palinHash.find(string[i]);// 1
  //     if (thisLetter === undefined) {// h not found in table
  //       palinHash.set(string[i], 1);// set h in table
  //     } else {// h is in table
  //       palinHash.set(string[i], (thisLetter + 1));
  //     }
  //   }
  //   //here each letter should be in table now
  //   let middleLetter = 0;
  //   for (let i = 0; i < palinHash.array.length; i++) {
  //     console.log('Here:  ', palinHash.array[i]);
  //     if (palinHash.array[i] === undefined) {
  //       // console.log("Hi");//here there is no letter; keep going
  //     }
  //     else {
  //       //test if this letter is %2
  //       if (palinHash.array[i].value % 2 === 0) {
  //         //letter is palindrome-compliant keep looping
  //       }
  //       else {
  //         middleLetter++;
  //       }
  //     }
  //   }//end for loop here
  //   if (middleLetter > 1) {
  //     return false;
  //   }
  //   return true;
  // }
  //   const lor = new HashMap();
  //   lor.set('Hobbit', 'Bilbo');
  //   lor.set('Hobbit', 'Frodo');
  //   lor.set('Wizard', 'Gandolf');
  //   lor.set('Human', 'Aragon');
  //   lor.set('Elf', 'Legolas');
  //   lor.set('Maiar', 'The Necromancer');
  //   lor.set('Maiar', 'Sauron');
  //   lor.set('RingBearer', 'Gollum');
  //   lor.set('LadyOfLight', 'Galadriel');
  //   lor.set('HalfElven', 'Arwen');
  //   lor.set('Ent', 'Treebeard');
  //lor.log();
  //console.log(lor.find('Maiar'));
  const palinHash = new HashMap();
  // console.log(palindrome("racecar"));
  //console.log(palindrome("hannah"));
  // palinHash._hashString('teas east');
  // palinHash._hashString('east teas');
  // palinHash._hashString('seat');

  console.log('Done');

}

main();
