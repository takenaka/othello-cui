import inquirer from 'inquirer';
import { Board } from './model/board';
import { Othello } from './model/othello';
import { Player } from './model/player';

(async () => {
  try {
    const board = new Board();
    const player1 = new Player('black', '黒');
    const player2 = new Player('white', '白');

    const othello = new Othello(board, player1, player2);
    othello.init();
  } catch (e) {
    console.error(e.message);
  }
})();
