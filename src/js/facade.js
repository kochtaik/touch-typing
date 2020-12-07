/* eslint-disable no-alert */
/* eslint-disable no-console */
import Keyboard from './keyboard';
import Generator from './text-data';
import Game from './game';

class Facade {
  constructor(lang, mode = 'default') {
    this.lang = lang;
    this.mode = mode;
    this.elements = {
      startBtn: document.querySelector('#start'),
      languageList: document.querySelector('#language'),
      inputField: document.querySelector('#textinput'),
    };
  }

  init() {
    const { lang } = this;
    const generator = new Generator(lang);
    generator.pullText();
    const keyboard = new Keyboard(lang);
    keyboard.init();
    this.launchPrestartCountdown();
  }

  launchPrestartCountdown() {
    let counter = 3;
    const intervalId = setInterval(() => {
      if (counter === 0) {
        const text = document.querySelector('#text').textContent;
        const game = new Game(text, this.lang, this.mode);
        game.start();
        clearInterval(intervalId);
      } counter -= 1;
    }, 1000);
  }

  configureInterface() {
    const { startBtn, languageList } = this.elements;
    startBtn.addEventListener('click', () => {
      const { selectedIndex } = languageList.options;
      const selectedLanguage = languageList.options[selectedIndex].value;
      if (selectedLanguage === '') alert('Select language!');
      else {
        const facade = new Facade(selectedLanguage);
        facade.init();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const facade = new Facade('en');
  facade.configureInterface();
});
