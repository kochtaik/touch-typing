/* eslint-disable no-console */
class Game {
  constructor(text) {
    this.text = text;
    this.mistakes = 0;
    this.inputIndex = 0;
    this.start = this.start.bind(this);
    this.elements = {
      startBtn: document.querySelector('#start'),
      inputField: document.querySelector('#textinput'),
      textElem: document.querySelector('#text'),
    };
  }

  start() {
    // Game.startCountdown()
    const { inputField, startBtn } = this.elements;
    this.advance();
    inputField.focus();
    startBtn.disabled = true;
    inputField.addEventListener('input', () => {
      const enteredChar = inputField.value[inputField.value.length - 1];
      this.validateInput(enteredChar);
    });
  }

  advance() {
    const { inputIndex, text } = this;
    const { textElem } = this.elements;
    const unhighlightedChar = text.charAt(inputIndex);
    const highlightedChar = `<span class="text__content--char-highlighted">${unhighlightedChar}</span>`;
    const textCopy = [...text];
    textCopy.splice(inputIndex, 1, highlightedChar);
    textElem.innerHTML = textCopy.join('');
  }

  validateInput(char) {
    const requiredChar = this.text[this.inputIndex];
    console.log(requiredChar === char);
    if (requiredChar === char || (requiredChar === 'ё' && char === 'е')) {
      this.inputIndex += 1;
      this.advance();
    }
  }
}

export default Game;
