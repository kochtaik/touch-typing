// добавить блокировку всяких дейсвтий, если произошла ошибка в фетчинге
// исправить баг с отображением ошибок после точного режима
/* eslint-disable no-console */
import Keyboard from './keyboard';

class Game {
  constructor(text, lang, mode) {
    this.text = text.trim().split('\u00A0');
    this.lang = lang;
    this.mode = mode;
    this.mistakes = {
      total: 0,
      corrected: 0,
    };
    this.speed = 0;
    this.time = 0;
    this.wordInputIndex = 0;
    this.charInputIndex = 0;
    this.inputLength = 0;
    this.gameStatus = 'active';
    this.start = this.start.bind(this);
    this.handleBackspace = this.handleBackspace.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.hideBlackout = this.hideBlackout.bind(this);
    this.elements = {
      modal: document.querySelector('#end-game'),
      blackout: document.querySelector('#blackout'),
      startBtn: document.querySelector('#start'),
      textElem: document.querySelector('#text'),
      speed: document.querySelector('#speed'),
      time: document.querySelector('#time'),
      mistakes: document.querySelector('#mistakes'),
    };
  }

  start() {
    this.startCountdown();
    const { startBtn, textElem } = this.elements;
    startBtn.disabled = true;
    Keyboard.highlightKey(textElem.textContent[0]);
    if (this.mode === 'exact') {
      const textLength = textElem.textContent.length;
      this.allowedMistakesNum = Math.ceil(textLength / 100);
      this.setMistakesDisplaying();
    }
    document.addEventListener('keypress', this.handleKeypress);
    document.addEventListener('keydown', this.handleBackspace);
    this.createCaretElem();
    this.scrollText();

  }

  handleKeypress(e) {
    e.preventDefault();
    const enteredChar = e.key;
    this.validateInput(enteredChar);
    this.watchGameStatus();
  }

  handleBackspace(e) {
    if (e.key !== 'Backspace') return;
    const backspace = e.key;
    this.validateInput(backspace);
  }

  startCountdown() {
    const addZero = (value) => (value < 10 ? `0${value}` : value);
    const start = Date.now();
    const timerId = setInterval(() => {
      const secondsPassed = addZero(Math.floor((Date.now() - start) / 1000) % 60);
      const minutesPassed = addZero(Math.floor((Date.now() - start) / 60000) % 60);
      const currentSpeed = this.countSpeed();
      this.time = Date.now() - start;
      this.speed = currentSpeed;
      this.elements.time.textContent = `${minutesPassed}:${secondsPassed}`;
      this.elements.speed.textContent = `${currentSpeed} CPM`;
    }, 1000);
    const timerWatcher = setInterval(() => {
      if (this.gameStatus === 'completed'
        || this.gameStatus === 'failed') {
        clearInterval(timerId);
        clearInterval(timerWatcher);
      }
    }, 1);
  }

  watchGameStatus() {
    if (this.isGameOver()) {
      this.endGame();
    }
  }

  getCurrentChar() {
    const { inputIndex, text } = this;
    return text[inputIndex];
  }

  validateInput(enteredChar) {
    if (enteredChar === 'Backspace'
    && this.wordInputIndex === 0 && this.charInputIndex === 0) return;

    const wordElement = document.querySelector(`#word${this.wordInputIndex}`);
    if (wordElement == null) return;

    const wordToCompare = wordElement.textContent;

    const charToCompare = wordToCompare[this.charInputIndex];
    if (enteredChar === 'Backspace') {
      this.changeIndexes('decrement');
      this.removeHighlight();
    } else if (Game.isMistake(enteredChar, charToCompare)) {
      this.updateTextElem(false);
      this.changeIndexes('increment');
      this.updateMistakes(false);
    } else if (Game.isCorrect(enteredChar, charToCompare)) {
      this.updateTextElem(true);
      this.changeIndexes('increment');
    }
    this.toggleKeyboardHighlight();
    this.scrollText();
    this.moveCaret();
  }

  static isCorrect(enteredChar, charToCompare) {
    if (enteredChar === charToCompare || Game.isSpace(enteredChar, charToCompare)) {
      return true;
    } return false;
  }

  static isMistake(enteredChar, charToCompare) {
    if (enteredChar !== charToCompare && !Game.isSpace(enteredChar, charToCompare)) {
      return true;
    } return false;
  }

  static isSpace(enteredChar, charToCompare) {
    if (enteredChar === '\u0020' && charToCompare === '\u00A0') return true;
    return false;
  }

  updateTextElem(isCorrect) {
    const { charInputIndex } = this;
    this.highlightChar(charInputIndex, isCorrect);
  }

  highlightChar(index, isCorrect) {
    const char = document.querySelector(`#word${this.wordInputIndex} > span:nth-child(${index + 1})`);
    if (char === null) return;
    if (isCorrect) {
      char.classList.add('word__char--char-correct');
    } else {
      char.classList.add('word__char--char-mistaked');
    }
  }

  removeHighlight() {
    const { wordInputIndex, charInputIndex } = this;
    const char = document.querySelector(`#word${wordInputIndex} > span:nth-child(${charInputIndex + 1})`);
    if (char === null) return;
    if (char.classList.contains('word__char--char-correct')) {
      char.classList.remove('word__char--char-correct');
    } else {
      char.classList.remove('word__char--char-mistaked');
      this.updateMistakes(true);
    }
  }

  toggleKeyboardHighlight() {
    const wordElem = document.querySelector(`#word${this.wordInputIndex}`);
    if (wordElem == null) return;
    let wordToCompare = wordElem.textContent;

    Keyboard.unhighlightKey();
    wordToCompare = document.querySelector(`#word${this.wordInputIndex}`).textContent;
    Keyboard.highlightKey(wordToCompare[this.charInputIndex]);
  }

  changeIndexes(direction) {
    let wordToCompare = document.querySelector(`#word${this.wordInputIndex}`).textContent;
    const charToCompare = wordToCompare[this.charInputIndex];
    // console.log('char before:', this.charInputIndex);
    // console.log('word before:', this.wordInputIndex);
    if (charToCompare === wordToCompare[wordToCompare.length - 1]) {
      if (direction === 'increment') {
        this.wordInputIndex += 1;
        this.charInputIndex = 0;
        this.inputLength += 1;
      } else {
        this.charInputIndex -= 1;
        this.inputLength -= 1;
      }
    } else if (direction === 'increment') {
      this.charInputIndex += 1;
      this.inputLength += 1;
    } else if (this.charInputIndex === 0) {
      if (direction === 'decrement') {
        this.wordInputIndex -= 1;
        this.inputLength -= 1;
        wordToCompare = document.querySelector(`#word${this.wordInputIndex}`).textContent;
        this.charInputIndex = wordToCompare.length - 1;
      } else this.charInputIndex += 1;
    } else if (direction === 'decrement') {
      this.charInputIndex -= 1;
      this.inputLength -= 1;
    }
    // console.log('char after:', this.charInputIndex);
    // console.log('word after:', this.wordInputIndex);
  }

  scrollText() {
    const word = document.querySelector(`#word${this.wordInputIndex}`);
    if (word == null) return;
    word.scrollIntoView();
  }

  createCaretElem() {
    const { textElem } = this.elements;
    const caret = document.createElement('span');
    caret.classList.add('caret');
    caret.id = 'caret';
    this.elements.caret = caret;
    textElem.insertAdjacentElement('afterbegin', caret);
  }

  moveCaret() {
    const { charInputIndex, wordInputIndex } = this;
    const { caret } = this.elements;
    let сurrentChar = document.querySelector(`#word${wordInputIndex} > span:nth-child(${charInputIndex + 1})`);
    if (сurrentChar == null) {
      const currentWord = document.querySelector(`#word${wordInputIndex - 1}`);
      сurrentChar = currentWord.lastChild;
      const { x, width } = сurrentChar.getBoundingClientRect();
      caret.style.left = `${x + width}px`;
    } else {
      const { x, y } = сurrentChar.getBoundingClientRect();
      caret.style.left = `${x}px`;
      caret.style.top = `${y}px`;
    }
  }

  countSpeed() {
    const { inputLength, time } = this;
    const minutes = Math.floor(time) / 60000;
    return Math.round(inputLength / minutes);
  }

  updateMistakes(corrected) {
    if (corrected) {
      this.mistakes.corrected += 1;
    } else this.mistakes.total += 1;
    const { mistakes } = this.elements;
    mistakes.textContent = this.mistakes.total;
  }

  isGameOver() {
    const { textElem } = this.elements;
    if (this.mode === 'exact') {
      if (this.mistakes.total === this.allowedMistakesNum) {
        this.gameStatus = 'failed';
        return true;
      } if (this.inputLength === textElem.textContent.length) {
        this.gameStatus = 'completed';
        return true;
      }
    }
    if (this.inputLength === textElem.textContent.length) {
      this.gameStatus = 'completed';
      return true;
    }
    return false;
  }

  endGame() {
    const {
      modal,
      startBtn, blackout,
    } = this.elements;
    startBtn.disabled = false;
    document.removeEventListener('keypress', this.handleKeypress);
    document.removeEventListener('keydown', this.handleBackspace);
    const title = document.createElement('h1');
    title.textContent = 'Game over!';
    modal.insertAdjacentElement('beforeend', title);
    const message = this.createEndGameMessage();
    modal.insertAdjacentElement('beforeend', message);
    modal.classList.add('modal--active');
    blackout.classList.add('blackout--active');
    document.body.classList.add('prevent-scroll');
    blackout.addEventListener('click', this.hideBlackout);
  }

  createEndGameMessage() {
    const parsedTime = Game.parseTime(this.time);
    const successMessage = `Congrats! You have typed the text at the speed ${this.speed}
    CPM in ${parsedTime}, having committed ${this.mistakes.total} mistakes.`;
    const unsuccsessMessage = `You commited more than ${this.allowedMistakesNum} allowed mistakes.
    You have typed the text at the speed ${this.speed} CPM in ${parsedTime}.`;
    const description = document.createElement('p');
    if (this.gameStatus === 'failed') description.textContent = unsuccsessMessage;
    else description.textContent = successMessage;
    return description;
  }

  hideBlackout() {
    const { blackout, modal } = this.elements;
    blackout.classList.remove('blackout--active');
    modal.classList.remove('modal--active');
    modal.innerHTML = '';
    document.body.classList.remove('body--prevent-scroll');
    blackout.removeEventListener('click', this.hideBlackout);
  }

  setMistakesDisplaying() {
    const { mistakes } = this.elements;
    const wrapper = mistakes.parentNode;
    if (this.mode === 'exact') {
      wrapper.innerHTML = `Mistakes: <span id="mistakes">${this.mistakes.total}</span>/${this.allowedMistakesNum}`;
    } else wrapper.innerHTML = `Mistakes: <span id="mistakes">${this.mistakes.total}</span>`;
    this.elements.mistakes = document.querySelector('#mistakes');
  }

  static parseTime(time) {
    const addZero = (value) => (value < 10 ? `0${value}` : value);
    const seconds = addZero(Math.floor(time / 1000) % 60);
    const minutes = addZero(Math.floor(time / 60000) % 60);
    return `${minutes}:${seconds}`;
  }
}

export default Game;
