// добавить блокировку всяких дейсвтий, если произошла ошибка в фетчинге
// не добавлять результаты неоконченных игр в статистику
// исправить баг с отображением ошибок после точного режима
/* eslint-disable no-console */
import Keyboard from './keyboard';
import Statistics from './stats';

class Game {
  constructor(text, lang, mode) {
    this.text = text.trim().split('');
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
    textElem.focus();
    textElem.classList.add('text-wrapper--active');
    if (this.mode === 'exact') {
      this.allowedMistakesNum = Math.ceil(this.text.length / 100);
      this.setMistakesDisplaying();
    }
    document.addEventListener('keypress', (e) => {
      if (e.altKey) return;
      e.preventDefault();
      const enteredChar = e.key;
      this.validateInput(enteredChar);
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
    // const gameStatusWatcher = setInterval(() => {
    //   if (this.isGameOver()) {
    //     clearInterval(timerId);
    //     clearInterval(gameStatusWatcher);
    //     const stats = new Statistics(this.mode, this.lang, this.speed,
    //       this.mistakes.count, this.time);
    //     stats.updateStats();
    //     this.endGame();
    //   }
    // }, 1);
  }

  getCurrentChar() {
    const { inputIndex, text } = this;
    return text[inputIndex];
  }

  static highlightChar(index, isCorrect) {
    const char = document.querySelector(`#char${index}`);
    if (char === null) return;
    if (isCorrect) {
      char.classList.add('text-wrapper__container__char--char-correct');
    } else char.classList.add('text-wrapper__container__char--char-mistaked');
  }

  static getModificator(correct) {
    let classPostfix;
    if (correct) classPostfix = '--char-correct';
    else classPostfix = '--char-mistaked';
    return classPostfix;
  }

  validateInput(enteredChar) {
    const charToCompare = this.text[this.inputIndex];
    if (Game.isMistake(enteredChar, charToCompare)) {
      this.updateTextElem(false, enteredChar);
    } else if (Game.isCorrect(enteredChar, charToCompare)) {
      this.updateTextElem(true);
    }
    this.inputIndex += 1;
  }

  static isCorrect(enteredChar, charToCompare) {
    if (enteredChar === charToCompare || Game.isSpace(enteredChar, charToCompare)) {
      return true;
    } return false;
  }

  static isMistake(enteredChar, charToCompare) {
    console.log(enteredChar === charToCompare);
    if (enteredChar !== charToCompare && !Game.isSpace(enteredChar, charToCompare)) {
      return true;
    } return false;
  }

  static isSpace(enteredChar, charToCompare) {
    if (enteredChar === '\u0020' && charToCompare === '\u00A0') return true;
    return false;
  }

  updateTextElem(isCorrect) {
    const { inputIndex } = this;
    if (inputIndex > 0) Keyboard.unhighlightKey();
    Game.highlightChar(inputIndex, isCorrect);
  }

  static scrollTextareaDown() {
    const highlightedChar = document.querySelector('#text > span');
    const textWrapper = document.querySelector('.text-wrapper');
    if (highlightedChar.offsetTop > 140) {
      textWrapper.scrollTop += 20;
    }
  }

  endGame() {
    const {
      modal,
      startBtn, blackout,
    } = this.elements;
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

  setMistakesDisplaying() {
    const mistakesElem = document.createElement('span');
    mistakesElem.id = 'mistakes';
    if (this.mode === 'exact') {
      mistakesElem.textContent = `${this.mistakes.count}/${this.allowedMistakesNum}`;
    } else {
      mistakesElem.textContent = this.mistakes.count;
    }
    this.elements.mistakes.replaceWith(mistakesElem);
  }
}

export default Game;
