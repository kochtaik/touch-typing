// сделать функцию-релейсер на циклах
// в русских текстах заменить двойные пробелы на одинарные

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
    fetch(url).then((data) => data.json())
      .then((obj) => {
        const { textField } = this.elements;
        if (this.lang === 'en') {
          textField.textContent = Generator.parseText(obj.text);
        } else textField.textContent = obj.text;
      });
  }

  static parseText(textArray) {
    const symbolsToReplace = {
      '--': '-',
      '  ': ' ',
      '“': '"',
      '”': '"',
    };
    const splittedInWords = textArray.join('');
    const correctText = this.replacer(splittedInWords, symbolsToReplace);
    return Generator.formSentences(correctText.split(' '));
  }

  static replacer(str, symbols) {
    let correctStr = str;
    const pairs = Object.entries(symbols);
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
