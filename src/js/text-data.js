class Generator {
  constructor(lang) {
    this.lang = lang;
    this.elements = {
      textField: document.querySelector('#text'),
    };
  }

  pullText() {
    const url = this.lang === 'en' ? 'https://litipsum.com/api/1/json'
      : 'https://fish-text.ru/get?&type=sentence&number=3';
    const { textField } = this.elements;
    fetch(url).then((data) => data.json())
      .then((obj) => {
        textField.innerHTML = '';
        if (this.lang === 'en') this.formText(Generator.parseText(obj.text));
        else this.formText(Generator.replacer(obj.text));
      }).catch((e) => {
        textField.textContent = 'Oops! Something went wrong:( Retry later';
        throw new Error('Error in asynchronous function:', e);
      });
  }

  formText(text) {
    const { textField } = this.elements;
    text.split('\u00A0').forEach((word, wordIndex) => {
      const wordElem = document.createElement('div');
      wordElem.id = `word${wordIndex}`;
      const characters = [...word];
      characters.push('\u00A0');
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
    const splittedInWords = textArray.join('');
    const correctText = this.replacer(splittedInWords);
    return Generator.formSentences(correctText.split(' '));
  }

  static replacer(str) {
    const symbolsToReplace = {
      '--': ' - ',
      '  ': ' ',
      '“': '"',
      '”': '"',
      '’': '\'',
      // eslint-disable-next-line quote-props
      'ё': 'е',
      ' ': '\u00A0',
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
    const exclude = /([A-Z]|St|Dr|Mrs?)\./;
    let sentence = '';
    let sentenceCounter = 0;
    const result = [];
    text.forEach((word) => {
      if (sentenceCounter >= 5) return;
      if (word.includes('.')) {
        if (exclude.test(word)) sentence += `${word} `;
        else {
          sentence += `${word} `;
          result.push(sentence);
          sentenceCounter += 1;
          sentence = '';
        }
      } else sentence += `${word} `;
    });
    return result.join('');
  }
}

export default Generator;
