import Game from './game';

class Generator {
  constructor(lang) {
    this.lang = lang;
    this.elements = {
      textField: document.querySelector('#text'),
      modeSwitcher: document.querySelector('#mode'),
      languageSwitcher: document.querySelector('#language'),
    };
  }

  initializeGame() {
    const url = this.lang === 'en' ? 'https://litipsum.com/api/1/json'
      : 'https://fish-text.ru/get?&type=sentence&number=2';
    const { textField } = this.elements;
    fetch(url).then((data) => data.json())
      .then((obj) => {
        textField.innerHTML = '';
        if (this.lang === 'en') {
          const totalText = Generator.parseText(obj.text);
          if (totalText.length < 50) {
            this.initializeGame();
          } return this.formText(Generator.parseText(obj.text));
        } return this.formText(Generator.replacer(obj.text));
      })
      .then(() => {
        const text = document.querySelector('#text').textContent;
        const { languageSwitcher } = this.elements;
        const chosenLang = languageSwitcher.dataset.lang;
        const game = new Game(text, chosenLang);
        game.start();
      })
      .catch((err) => {
        textField.textContent = 'Oops! Something went wrong:( Retry later';
        throw new Error('Error in asynchronous function:', err.message);
      });
  }

  formText(text) {
    const { textField } = this.elements;
    const splittedText = text.split('\u00A0');
    splittedText.forEach((word, wordIndex) => {
      const wordElem = document.createElement('div');
      wordElem.id = `word${wordIndex}`;
      const characters = [...word];
      if (wordIndex !== splittedText.length - 1) characters.push('\u00A0');
      characters.forEach((char) => {
        const charWrapper = document.createElement('span');
        charWrapper.innerText = char;
        charWrapper.classList.add('word__char');
        wordElem.insertAdjacentElement('beforeend', charWrapper);
      });
      wordElem.classList.add('word');
      textField.insertAdjacentElement('beforeend', wordElem);
    });
  }

  static parseText(textArray) {
    const textString = textArray.join('');
    const correctText = this.replacer(textString);
    return Generator.formSentences(correctText.split('\u00A0'));
  }

  static replacer(str) {
    const symbolsToReplace = {
      '--': ' - ',
      '  ': ' ',
      '“': '"',
      '”': '"',
      '’': '\'',
      ' ': '\u00A0',
      ё: 'е',
    };
    let correctStr = str;
    const pairs = Object.entries(symbolsToReplace);
    pairs.forEach(([mistaked, correct]) => {
      while (correctStr.includes(mistaked)) {
        correctStr = correctStr.replace(mistaked, correct);
      }
    });
    return correctStr;
  }

  static formSentences(text) {
    const hasDelimeters = (word, delimters) => word.some((char) => delimters.includes(char));
    const exclude = /([A-Z]|St|Dr|Mrs?)\./;
    let sentence = '';
    let sentenceCounter = 0;
    const result = [];
    text.forEach((word) => {
      const sentencesDelimeters = ['.', '!', ';', '?'];
      if (sentenceCounter >= 3) return;
      if (hasDelimeters([...word], sentencesDelimeters)) {
        if (exclude.test(word)) sentence += `${word}\u00A0`;
        else {
          sentence += `${word}\u00A0`;
          result.push(sentence);
          sentenceCounter += 1;
          sentence = '';
        }
      } else sentence += `${word}\u00A0`;
    });
    let totalText = result.join('').trim();
    if (!Generator.areQuotesBalanced(totalText)) totalText += '"';
    return totalText;
  }

  static areQuotesBalanced(str) {
    const quotesNum = [...str].reduce((acc, char) => (char === '"' ? acc += 1 : acc), 0);
    return quotesNum % 2 === 0;
  }
}

export default Generator;
