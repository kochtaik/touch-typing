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
    const splittedInWords = textArray.join('')
      .replace('--', ' - ')
      .replace('“', '"')
      .replace('”', '"')
      .split(' ');
    return Generator.handleDots(splittedInWords);
  }

  static handleDots(text) {
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
