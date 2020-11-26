import Keyboard from './module';

window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard('ru');
  keyboard.generateKeyboard();
})