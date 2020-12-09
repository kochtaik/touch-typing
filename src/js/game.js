// исправить баг при изменении позиции курсора и удалении текста.
// добавить блокировку всяких дейсвтий, если произошла ошибка в фетчинге
// добавить нормальное окончание игры
/* eslint-disable no-console */
import Keyboard from './keyboard';
import Statistics from './stats';

class Game {
  constructor(text, lang, mode) {
    this.text = text.trim();
    this.lang = lang;
    this.mode = mode;
    this.mistakes = {
      count: 0,
      committed: false,
    };
    this.speed = 0;
    this.time = 0;
    this.inputIndex = 0;
    this.input = '';
    this.gameStatus = 'active';
    this.start = this.start.bind(this);
    this.hideBlackout = this.hideBlackout.bind(this);
    this.elements = {
      modal: document.querySelector('#end-game'),
      blackout: document.querySelector('#blackout'),
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
    const { inputField, startBtn, textElem } = this.elements;
    this.updateTextElem(true);
    inputField.disabled = false;
    inputField.focus();
    inputField.value = '';
    startBtn.disabled = true;
    textElem.classList.add('text-wrapper--active');
    if (this.mode === 'exact') {
      this.allowedMistakesNum = Math.ceil(this.text.length / 100);
      this.setMistakesInExactMode();
    }
    inputField.addEventListener('input', () => {
      const enteredChar = inputField.value[inputField.value.length - 1];
      this.validateInput(enteredChar);
      Game.scrollTextareaDown();
      this.isGameOver();
    });
  }

  startCountdown() {
    const addZero = (value) => (value < 10 ? `0${value}` : value);
    const start = Date.now();
    const timerId = setInterval(() => {
      const secondsPassed = addZero(Math.floor((Date.now() - start) / 1000) % 60);
      const minutesPassed = addZero(Math.floor((Date.now() - start) / 60000) % 60);
      const currentSpeed = Math.round(this.input.length / ((parseInt(secondsPassed, 10)
      / 60) + parseInt(minutesPassed, 10)));
      this.time = Date.now() - start;
      this.speed = currentSpeed;

      this.elements.time.textContent = `${minutesPassed}:${secondsPassed}`;
      this.elements.speed.textContent = `${currentSpeed} CPM`;
    }, 1000);
    const gameStatusWatcher = setInterval(() => {
      if (this.isGameOver()) {
        clearInterval(timerId);
        clearInterval(gameStatusWatcher);
        const stats = new Statistics(this.mode, this.lang, this.speed,
          this.mistakes.count, this.time);
        stats.updateStats();
        this.endGame();
      }
    }, 1);
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
            if (this.mode === 'exact') {
              this.setMistakesInExactMode();
              if (this.mistakes.count === this.allowedMistakesNum) this.gameStatus = 'failed';
            } else this.elements.mistakes.textContent = this.mistakes.count;
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

  static scrollTextareaDown() {
    const highlightedChar = document.querySelector('#text > span');
    const textWrapper = document.querySelector('.text-wrapper');
    if (highlightedChar.offsetTop > 140) {
      textWrapper.scrollTop += 20;
    }
  }

  isGameOver() {
    if (this.text === this.input || this.gameStatus === 'failed') {
      return true;
    } return false;
  }

  endGame() {
    const {
      inputField, modal,
      startBtn, blackout,
    } = this.elements;
    inputField.disabled = true;
    startBtn.disabled = false;
    const title = document.createElement('h1');
    title.textContent = 'Game over!';
    modal.insertAdjacentElement('beforeend', title);
    const message = this.createEndGameMessage();
    modal.insertAdjacentElement('beforeend', message);
    modal.classList.add('modal--active');
    blackout.classList.add('blackout--active');
    document.body.classList.add('body--prevent-scroll');
    blackout.addEventListener('click', this.hideBlackout);
    this.text = '';
    this.inputIndex = 0;
  }

  createEndGameMessage() {
    const { inputField } = this.elements;
    const parsedTime = Statistics.parseTime(this.time);
    const successMessage = `Congrats! You have typed the text at the speed ${this.speed}
    CPM in ${parsedTime}, having committed ${this.mistakes.count} mistakes.`;
    const unsuccsessMessage = `You commited more than ${this.allowedMistakesNum} allowed mistakes.
    You have typed the text at the speed ${this.speed} CPM in ${parsedTime}.`;
    const description = document.createElement('p');

    if (this.text !== inputField.value) description.textContent = unsuccsessMessage;
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

  setMistakesInExactMode() {
    this.elements.mistakes.innerHTML = `<span>${this.mistakes.count}</span>/<span>${this.allowedMistakesNum}</span>`;
  }
}

export default Game;
