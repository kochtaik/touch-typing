/* eslint-disable no-console */
class Statistics {
  constructor(mode, lang, speed, mistakes, time) {
    this.mode = mode;
    this.lang = lang;
    this.speed = speed;
    this.mistakes = mistakes;
    this.time = time;
    this.sortCriterium = 'speed';
    this.configure = this.configure.bind(this);
    this.elements = {
      table: document.querySelector('#results'),
      modalWindowLangList: document.querySelector('#modalLanguage'),
      sortCriteria: document.querySelector('#sort'),
    };
  }

  configure() {
    const { modalWindowLangList, sortCriteria } = this.elements;
    modalWindowLangList.addEventListener('change', () => {
      const { selectedIndex } = modalWindowLangList.options;
      const selectedLanguage = modalWindowLangList.options[selectedIndex].value;
      this.changeLang(selectedLanguage);
    });
    sortCriteria.addEventListener('change', () => {
      const { selectedIndex } = sortCriteria.options;
      const selectedCriterium = sortCriteria.options[selectedIndex].value;
      this.sortCriterium = selectedCriterium;
      this.updateStats();
    });
  }

  updateStats() {
    const games = {
      default: [],
      exact: [],
    };
    const game = {
      speed: this.speed,
      time: this.time,
      mistakes: this.mistakes,
      lang: this.lang,
    };
    if (localStorage.getItem(this.lang) !== null) {
      const sameLanguageGames = JSON.parse(localStorage.getItem(this.lang));
      games[this.mode] = sameLanguageGames[this.mode];
    } else if (games[this.mode].length > 9) games[this.mode].pop();
    games[this.mode].push(game);
    games[this.mode] = this.sortGames(this.sortCriterium);
    localStorage.setItem(this.lang, JSON.stringify(games));
    this.displayStats();
  }

  displayStats() {
    const games = JSON.parse(localStorage.getItem(this.lang));
    const { table } = this.elements;
    table.innerHTML = '';
    games[this.mode].forEach((game, index) => {
      const { speed, mistakes, time } = game;
      const parsedTime = Statistics.parseTime(time);
      const gameElem = document.createElement('span');
      const tableRow = `<span>${index + 1}</span><span>${speed}</span><span>${parsedTime}</span><span>${mistakes}</span>`;
      gameElem.insertAdjacentHTML('beforeend', tableRow);
      table.insertAdjacentElement('beforeend', gameElem);
    });
  }

  sortGames(criterium = 'speed') {
    const games = JSON.parse(localStorage.getItem(this.lang));
    return games[this.mode].sort((game1, game2) => (criterium === 'speed' ? game2[criterium] - game1[criterium] : game1[criterium] - game2[criterium]));
  }

  changeLang(selectedLang) {
    if (selectedLang === 'en') {
      this.lang = 'ru';
    } else this.lang = 'en';
    this.displayStats();
  }

  static parseTime(time) {
    const addZero = (value) => (value < 10 ? `0${value}` : value);
    const seconds = addZero(Math.floor(time / 1000) % 60);
    const minutes = addZero(Math.floor(time / 60000) % 60);
    return `${minutes}:${seconds}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const stats = new Statistics('default', 'en');
  stats.displayStats();
  stats.configure();
});

export default Statistics;
