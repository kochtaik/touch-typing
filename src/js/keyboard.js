class Keyboard {
  constructor(lang) {
    this.lang = lang;
    this.elements = {
      keyboardField: document.querySelector('#keyboard'),
    };

    this.data = {
      HTMLCodes: {
        backspace: '&larr;',
        capsLock: '&uarr;',
        tab: '&#8633;',
      },
      keyCodes: ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace',
        'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight',
        'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash',
        'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight',
        'Space'],
      englishLayout: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
        'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
        'capsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '#',
        'shiftL', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shiftR',
        'space'],
      russianLayout: ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
        'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
        'capsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', '\\',
        'shiftL', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'shiftR',
        'space'],
    };
  }

  init() {
    const keys = document.querySelectorAll('.keyboard__key'); // refactor
    if (keys.length !== 0) {
      this.elements.keyboardField.innerHTML = '';
    }
    this.generateKeyboard();
    // document.addEventListener('keydown', (e) => {
    //   this.highlightKey(e.code);
    // });
    // document.addEventListener('keyup', (e) => {
    //   this.unhighlightKey(e.code);
    // });
  }

  generateKeyboard() {
    const fragment = document.createDocumentFragment();
    const keys = this.lang === 'en' ? this.data.englishLayout : this.data.russianLayout;
    const marginElements = this.lang === 'en' ? ['backspace', ']', '#', 'ShiftR'] : ['backspace', 'ъ', '\\', 'shiftR'];
    const isMargin = (el) => marginElements.indexOf(el) !== -1;

    keys.forEach((char) => {
      const key = document.createElement('div');
      key.classList.add('keyboard__key');
      const characterWrapper = document.createElement('span');
      characterWrapper.classList.add('keyboard__key__char');

      switch (char) {
        case 'backspace':
          characterWrapper.textContent = this.data.HTMLCodes.backspace;
          key.style.width = '9%';
          key.dataset.type = 'backspace';
          break;

        case 'tab':
          characterWrapper.textContent = this.data.HTMLCodes.tab;
          key.style.width = '9%';
          key.dataset.type = 'tab';
          break;

        case 'capsLock':
          characterWrapper.textContent = this.data.HTMLCodes.capsLock;
          key.style.width = '10%';
          key.dataset.type = 'capsLock';
          break;

        case 'shiftL':
          characterWrapper.textContent = '&larr';
          key.style.width = '12%';
          key.dataset.type = 'shiftL';
          break;

        case 'shiftR':
          characterWrapper.textContent = '&larr';
          key.dataset.type = 'shiftR';
          key.style.width = '12%';
          break;

        case 'space':
          characterWrapper.textContent = '';
          key.classList.add('keyboard__key--extrawide');
          key.dataset.type = 'space';
          break;

        default:
          characterWrapper.textContent = char.toLowerCase();
          key.dataset.type = char.toLowerCase();
          break;
      }

      const index = keys.indexOf(char);
      key.dataset.code = this.data.keyCodes[index];
      key.appendChild(characterWrapper);
      Keyboard.colorKey(key);
      fragment.appendChild(key);
      if (isMargin(char)) fragment.appendChild(document.createElement('br'));
    });

    this.elements.keyboardField.appendChild(fragment);
    this.elements.keyboardKeys = document.querySelectorAll('.keyboard__key');
  }

  static colorKey(key) {
    const fingerZones = {
      mericularFingers: {
        values: ['`', '1', '2', 'tab', 'capsLock', 'shiftL',
          'shiftR', 'q', 'й', 'a', 'ф', 'я', 'z', 'з', 'p', '0',
          '-', '=', 'х', 'ъ', '[', ']', '\'', '\\', '/', 'ё', ';',
          'backspace', '#', 'ж', 'э'],
        className: 'keyboard__key--blue',
      },
      ringFingers: {
        values: ['w', 's', 'x', 'o', 'l', '.', '9', '3',
          'ц', 'ы', 'ч', 'щ', 'д', 'ю'],
        className: 'keyboard__key--green',
      },
      middleFingers: {
        values: ['e', 'd', 'c', '4', ',', '8', 'i', 'k',
          'у', 'в', 'с', 'б', 'ш', 'л'],
        className: 'keyboard__key--rose',
      },
      leftPointerFinger: {
        values: ['5', '6', 'r', 'f', 'v', 't', 'g', 'b',
          'к', 'а', 'м', 'е', 'п', 'и'],
        className: 'keyboard__key--orange',
      },
      rightPointerFinger: {
        values: ['7', 'y', 'h', 'n', 'u', 'j', 'm',
          'н', 'р', 'т', 'г', 'о', 'ь'],
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

  static highlightKey() {
    const char = document.querySelector('.text__content--char-correct').textContent;
    const keyToPress = Array.from(document.querySelectorAll('.keyboard__key'))
      .find((keyElem) => keyElem.dataset.type === char.toLowerCase());
    console.log(keyToPress);
    if (keyToPress === undefined) return;
    keyToPress.classList.add('keyboard__key--pressed');
  }
}

export default Keyboard;
