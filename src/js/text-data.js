class Generator {
  constructor(lang) {
    this.lang = lang;
    this.elements = {
      textField: document.querySelector('#text'),
    };
  }

  getText() {
    const getEnglishText = () => {
      const url = 'https://litipsum.com/api/1/json';
      fetch(url).then((data) => data.json())
        .then((obj) => {
          this.elements.textField.textContent = this.parseText(obj.text);
        });
    };

    const getRussianText = () => {
      console.log('here a russian text will be displayed')
    }
    return this.lang === 'en' ? getEnglishText() : getRussianText();
  }

  parseText(textArray) {
    const splittedInWords = textArray.join('').replace('--', ' - ').split(' ');
    return this.handleDots(splittedInWords);
  }

  handleDots(text) {
    const exclude = /(Dr|Mrs?)\./;
    let sentence = '';
    let sentenceCounter = 0;
    const result = [];
    for (const value of text) {
      if (sentenceCounter >= 5) break;
      if (value.includes('.')) {
        if (exclude.test(value)) sentence += `${value} `;
        else {
          sentence += `${value} `;
          result.push(sentence);
          sentenceCounter += 1;
          sentence = '';
        }
      } else sentence += `${value} `;
    }
    console.log(sentenceCounter)
    return result.join('');
  }
}

export default Generator;
