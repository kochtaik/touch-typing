import Keyboard from './module';

window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard('ru');
  keyboard.generateKeyboard();
  document.addEventListener('keydown', (e) => {
    keyboard.highlightKey(e.code);
  });
  document.addEventListener('keyup', (e) => {
    keyboard.unhighlightKey(e.code);
  });
});
