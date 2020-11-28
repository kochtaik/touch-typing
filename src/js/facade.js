import Keyboard from './keyboard';
import Generator from './text-data';

window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard('en');
  keyboard.generateKeyboard();
  document.addEventListener('keydown', (e) => {
    keyboard.highlightKey(e.code);
  });
  document.addEventListener('keyup', (e) => {
    keyboard.unhighlightKey(e.code);
  });
  // keyboard.init();
  const text = new Generator('en');
  text.getText();
});
