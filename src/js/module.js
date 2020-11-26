class Keyboard {
  constructor(lang) {
    this.lang = lang;
    this.elements = {
      keyboardField: document.querySelector('#keyboard'),
    }
    this.HTMLCodes = {
      backspace: '&larr;',
      capsLock: '&uarr;',
      tab: '&#8633;',
    }
  }

  generateKeyboard() {
    const fragment = document.createDocumentFragment();
    const keys = ['`', '1', '2', '3', '4','5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
    'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
    'capsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '#',
    'shiftL', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shiftR',
    'space'];
    const marginElements = ['backspace', ']', '#', 'ShiftR'];

    keys.forEach((char) => {
      const key = document.createElement('div');
      key.classList.add('keyboard__key');
      const characterWrapper = document.createElement('span');
      characterWrapper.classList.add('keyboard__key__char');

      switch(char) {
        case "backspace": 
          characterWrapper.textContent = this.HTMLCodes.backspace;
          key.style.width = '9%';
          key.dataset.type = 'backspace';
          break;

        case "tab": 
          characterWrapper.textContent = this.HTMLCodes.tab;
          key.style.width = '9%';
          key.dataset.type = 'tab';
          break;

        case "capsLock": 
          characterWrapper.textContent = this.HTMLCodes.capsLock;
          key.style.width = '10%';
          key.dataset.type = 'capsLock';
          break;

        case "shiftL":
          characterWrapper.textContent = '&larr';
          key.style.width = '12%';
          key.dataset.type = 'shiftL';
          break;

        case "shiftR":
          characterWrapper.textContent = '&larr';
          key.dataset.type = 'shiftR';
          key.style.width = '12%';
          break;

        case "space": 
          characterWrapper.textContent = '';
          key.classList.add('keyboard__key--extrawide');
          key.dataset.type = 'space';
          break;

        default: 
          characterWrapper.textContent = char.toLowerCase();
          key.dataset.type = char.toLowerCase();
          break;
      }
      const isMargin = (el) => marginElements.indexOf(el) !== - 1;
      key.appendChild(characterWrapper);
      this.colorKey(key)
      fragment.appendChild(key);
      if (isMargin(char)) fragment.appendChild(document.createElement('br'));
    });
    this.elements.keyboardField.appendChild(fragment);
  }

  colorKey(key) {
    const fingerZones = {
      mericularFingers: {
        values: ['`', '1', '2', 'tab', 'capsLock', 'shiftL', 'shiftR', 'q', 'a', 'z', 'p', '0', '-', '=', '[', ']', '\'', '/', ';', 'backspace', '#'],
        className: 'keyboard__key--blue',
      },
      ringFingers: {
        values: ['w', 's', 'x', 'o', 'l', '.', '9', '3'],
        className: 'keyboard__key--green',
      },
      middleFingers: {
        values: ['e','d', 'c', '4', ',', '8', 'i', 'k'],
        className: 'keyboard__key--rose',
      },
      leftPointerFinger: {
        values: ['5', '6', 'r', 'f', 'v', 't', 'g', 'b'],
        className: 'keyboard__key--orange',
      },
      rightPointerFinger: {
        values: ['7', 'y', 'h', 'n', 'u', 'j', 'm'],
        className: 'keyboard__key--yellow',
      },
      thumbFinger: {
        values: ['space'],
        className: 'keyboard__key--gray',
      },
    };

    const keyValue = key.dataset.type;
    const keyGroups = Object.values(fingerZones);
    for (const group of keyGroups) {
      const { values, className } = group;
      if (values.includes(keyValue)) key.classList.add(className);
    }
  }
}

export default Keyboard;
