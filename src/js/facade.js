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
      modeSwitcher: document.querySelector('#mode'),
      startBtn: document.querySelector('#start'),
      languageSwitcher: document.querySelector('#language'),
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
    const { startBtn, languageSwitcher, modeSwitcher } = this.elements;
    languageSwitcher.addEventListener('click', () => {
      const control = languageSwitcher.querySelector('.toggle-switch__control');
      control.classList.toggle('toggle-switch__control--toggled');
      if (languageSwitcher.dataset.lang === 'en') {
        languageSwitcher.dataset.lang = 'ru';
      } else languageSwitcher.dataset.lang = 'en';
    });
    modeSwitcher.addEventListener('click', () => {
      const control = modeSwitcher.querySelector('.toggle-switch__control');
      control.classList.toggle('toggle-switch__control--toggled');
      if (modeSwitcher.dataset.mode === 'default') {
        modeSwitcher.dataset.mode = 'exact';
      } else modeSwitcher.dataset.mode = 'default';
    });
    startBtn.addEventListener('click', () => {
      const { lang } = languageSwitcher.dataset;
      const { mode } = modeSwitcher.dataset;
      const facade = new Facade(lang, mode);
      facade.init();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const facade = new Facade('en');
  facade.configureInterface();
});
