// исправить баг при изменении позиции курсора и удалении текста.
/* eslint-disable no-console */

class Game {
  constructor(text) {
    this.text = text;
    this.mistakes = {
      count: 0,
      committed: false,
    };
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
    this.updateTextElem(true);
    inputField.focus();
    startBtn.disabled = true;
    inputField.addEventListener('input', () => {
      const enteredChar = inputField.value[inputField.value.length - 1];
      this.validateInput(enteredChar);
    });
  }

  updateTextElem(isCorrect) {
    const { inputIndex, text } = this;
    const { textElem } = this.elements;
    const unhighlightedChar = this.getCurrentChar();
    const highlightedChar = Game.highlightCurrentChar(unhighlightedChar, isCorrect);
    const textCopy = [...text];
    textCopy.splice(inputIndex, 1, highlightedChar);
    textElem.innerHTML = textCopy.join('');
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
    let status;
    if (correct) {
      classPostfix = '--char-correct';
      status = 'correct';
    } else {
      classPostfix = '--char-mistaked';
      status = 'incorrect';
    }
    return `<span data-status="${status}"class="text__content${classPostfix}">${char}</span>`;
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
          if (inputsDiff === 1 && !this.mistakes.committed) this.mistakes.count += 1;
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
}

export default Game;
