/* eslint-disable no-console */
class Statistics {
  constructor(mode, lang, speed, mistakes, time) {
    this.mode = mode;
    this.lang = lang;
    this.speed = speed;
    this.mistakes = mistakes;
    this.time = time;
    this.elements = {
      table: document.querySelector('#results'),
    };
  }

  updateStats() {
    const games = {
      default: [],
      exact: [],
    };
    const game = {
      speed: this.speed,
      time: this.time,
      mistakes: this.mistakes.count,
      lang: this.lang,
    };
    if (localStorage.getItem(this.lang) !== null) {
      const sameLanguageGames = JSON.parse(localStorage.getItem(this.lang));
      games[this.mode] = sameLanguageGames[this.mode];
    }
    if (games[this.mode].length > 9) games[this.mode].pop();
    console.log(games);
    games[this.mode].push(game);
    games[this.mode] = Statistics.sortGames(games[this.mode]);
    localStorage.setItem(this.lang, JSON.stringify(games));
    this.displayStats();
  }

  displayStats() {
    const games = JSON.parse(localStorage.getItem(this.lang));
    const { table } = this.elements;
    const parsedTime = document.querySelector('#time').textContent;
    games.forEach((game, index) => {
      const { speed, mistakes } = game;
      const gameElem = document.createElement('span');
      const tableRow = `<span>${index + 1}</span><span>${speed}</span><span>${parsedTime}</span><span>${mistakes}</span>`;
      gameElem.insertAdjacentHTML('beforeend', tableRow);
      table.insertAdjacentElement('beforeend', gameElem);
    });
  }

  static sortGames(games, criterium = 'speed') {
    return games.sort((game1, game2) => (criterium === 'speed' ? game2[criterium] - game1[criterium] : game1[criterium] - game2[criterium]));
  }
}

export default Statistics;
