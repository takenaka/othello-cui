import { prompt } from 'inquirer';
import { Board } from './model/board';
import { IO } from './model/io';
import { Othello } from './model/othello';
import { Player } from './model/player';
import { StoneCreator } from './model/stone';

(async () => {
  try {
    const board = new Board();
    const player1 = new Player('black', '黒');
    const player2 = new Player('white', '白');
    const io = new IO(prompt);

    const othello = new Othello(board, StoneCreator, player1, player2, io);
    othello.init();
  } catch (e) {
    const _e = e as Error;
    console.error(_e.message);
  }
})();
