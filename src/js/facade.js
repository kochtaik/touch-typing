/* eslint-disable no-alert */
/* eslint-disable no-console */
import Keyboard from './keyboard';
import Generator from './text-data';

class Facade {
  constructor() {
    this.elements = {
      modeSwitcher: document.querySelector('#mode'),
      restartBtn: document.querySelector('#start'),
      languageSwitcher: document.querySelector('#language'),
      inputField: document.querySelector('#textinput'),
      textElem: document.querySelector('#text'),
    };
    this.lang = this.elements.languageSwitcher.dataset.lang;
    this.mode = this.elements.modeSwitcher.dataset.mode;
  }

  init() {
    const { lang } = this;
    const keyboard = new Keyboard(lang);
    keyboard.init();
    const generator = new Generator(lang);
    generator.initializeGame();
  }

  configureInterface() {
    const { restartBtn, languageSwitcher, modeSwitcher } = this.elements;
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
    restartBtn.addEventListener('click', () => {
      const facade = new Facade();
      facade.init();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const facade = new Facade();
  facade.init();
  facade.configureInterface();
});
