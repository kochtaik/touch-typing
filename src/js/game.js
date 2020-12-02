/* eslint-disable no-console */
class Game {
  constructor(text) {
    this.text = text;
    this.mistakes = 0;
    this.inputIndex = 0;
    this.input = '';
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
    this.advance(true);
    inputField.focus();
    startBtn.disabled = true;
    inputField.addEventListener('input', () => {
      const enteredChar = inputField.value[inputField.value.length - 1];
      this.validateInput(enteredChar);
    });
  }

  advance(isCorrect) {
    const { inputIndex, text } = this;
    const { textElem } = this.elements;
    const unhighlightedChar = this.getCurrentChar();
    const highlightedChar = Game.highlightCurrentChar(unhighlightedChar, isCorrect);
    const textCopy = [...text];
    textCopy.splice(inputIndex, 1, highlightedChar);
    textElem.innerHTML = textCopy.join('');
  }

  getCurrentChar() {
    const { inputIndex, text } = this;
    return text.charAt(inputIndex);
  }

  static highlightCurrentChar(char, isCorrect) {
    let classPostfix;
    if (isCorrect) {
      classPostfix = '--char-correct';
    } else classPostfix = '--char-mistaked';
    return `<span class="text__content${classPostfix}">${char}</span>`;
  }

  validateInput(char) {
    const requiredChar = this.text[this.inputIndex];
    const inputText = this.elements.inputField.value;
    const enteredCharIndex = inputText.length - 1;
    const requiredCharIndex = this.inputIndex;
    console.log('required:', requiredCharIndex);
    console.log('entered:', enteredCharIndex);
    if ((requiredCharIndex === enteredCharIndex) && (requiredChar === char)) {
      this.inputIndex += 1;
      this.advance(true);
    } else if (inputText.length < this.input.length) {
      this.inputIndex -= 1;
      const { inputField } = this.elements;
      const enteredChar = inputField.value[inputField.value.length - 1];
      this.validateInput(enteredChar);
      console.log('ready')
    } else {
      this.advance(false);
    }
    console.log('inputText', inputText.length)
    console.log('input', this.input.length)
  }
}

export default Game;
