// исправить баг при изменении позиции курсора и удалении текста.
/* eslint-disable no-console */
import Keyboard from './keyboard';

class Game {
  constructor(text) {
    this.text = text.trim();
    this.mistakes = {
      count: 0,
      committed: false,
    };
    this.inputIndex = 0;
    this.input = '';
    this.gameStatus = 'active';
    this.start = this.start.bind(this);
    this.elements = {
      startBtn: document.querySelector('#start'),
      inputField: document.querySelector('#textinput'),
      textElem: document.querySelector('#text'),
      speed: document.querySelector('#speed'),
      time: document.querySelector('#time'),
      mistakes: document.querySelector('#mistakes'),
    };
  }

  start() {
    this.startCountdown();
    const { inputField, startBtn } = this.elements;
    this.updateTextElem(true);
    inputField.focus();
    startBtn.disabled = true;
    inputField.addEventListener('input', () => {
      const enteredChar = inputField.value[inputField.value.length - 1];
      this.validateInput(enteredChar);
      Game.scrollTextareaDown();
    });
  }

  startCountdown() {
    const addZero = (value) => (value < 10 ? `0${value}` : value);
    const start = Date.now();
    const timerId = setInterval(() => {
      const secondsPassed = addZero(Math.floor((Date.now() - start) / 1000) % 60);
      const minutesPassed = addZero(Math.floor((Date.now() - start) / 60000) % 60);
      this.elements.time.textContent = `${minutesPassed}:${secondsPassed}`;
      if (this.isGameOver()) clearInterval(timerId);
    }, 1000);
  }

  updateTextElem(isCorrect) {
    const { inputIndex, text } = this;
    const { textElem } = this.elements;
    if (inputIndex > 0) Keyboard.unhighlightKey();
    const unhighlightedChar = this.getCurrentChar();
    const highlightedChar = Game.highlightCurrentChar(unhighlightedChar, isCorrect);
    const textCopy = [...text];
    textCopy.splice(inputIndex, 1, highlightedChar);
    textElem.innerHTML = textCopy.join('');
    Keyboard.highlightKey(unhighlightedChar.toLowerCase());
  }

  updateInputData(action = 'none') {
    const userInput = this.elements.inputField.value;
    if (action === 'increment') {
      this.inputIndex += 1;
    } else if (action === 'decrement') {
      this.inputIndex -= (this.input.length - userInput.length);
    }
    this.mistakes.committed = false;
    this.input = userInput;
  }

  getCurrentChar() {
    const { inputIndex, text } = this;
    return text.charAt(inputIndex);
  }

  static highlightCurrentChar(char, correct) {
    let classPostfix;
    if (correct) classPostfix = '--char-correct';
    else classPostfix = '--char-mistaked';
    return `<span class="text-wrapper__content${classPostfix}">${char}</span>`;
  }

  validateInput(enteredChar) {
    const userInput = this.elements.inputField.value;
    const inputsDiff = userInput.length - this.input.length;
    if (this.isCorrect(enteredChar)) {
      this.updateInputData('increment');
      this.updateTextElem(true);
    } else if (!this.isCorrect(enteredChar)) {
      if (userInput.length < this.input.length) {
        this.updateInputData('decrement');
        this.updateTextElem(true);
      } else if (inputsDiff >= 0) {
        if (userInput.length - 1 === this.input.length - 1) {
          this.updateInputData();
          this.updateTextElem(true);
        } else {
          if (inputsDiff === 1 && !this.mistakes.committed) {
            this.mistakes.count += 1;
            this.elements.mistakes.textContent = this.mistakes.count;
          }
          this.mistakes.committed = true;
          this.updateTextElem(false);
        }
      }
    }
  }

  isCorrect(enteredChar) {
    const requiredChar = this.text[this.inputIndex];
    const userInput = this.elements.inputField.value;
    const enteredCharIndex = userInput.length - 1;
    const requiredCharIndex = this.inputIndex;
    return (requiredCharIndex === enteredCharIndex)
      && (requiredChar === enteredChar);
  }

  isGameOver() {
    if (this.text === this.input) {
      return true;
    } return false;
  }

  static scrollTextareaDown() {
    const highlightedChar = document.querySelector('#text > span');
    const textWrapper = document.querySelector('.text-wrapper');
    if (highlightedChar.offsetTop > 140) {
      textWrapper.scrollTop += 100;
    }
  }
}

export default Game;
