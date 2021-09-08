import { Board } from './model/board';
import { IO } from './model/io';
import { Othello } from './model/othello';
import { Player } from './model/player';
import { StoneFactory } from './model/stone';

(async () => {
  try {
    const board = new Board();
    const player1 = new Player('black', '黒');
    const player2 = new Player('white', '白');

    const othello = new Othello(board, StoneFactory, player1, player2, IO);
    othello.init();
  } catch (e) {
    console.error(e.message);
  }
})();
