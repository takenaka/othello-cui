import { prompt } from 'inquirer';
import { Board } from './model/board';
import { IO } from './model/io';
import { Othello } from './model/othello';
import { PlayerCreator } from './model/player';
import { StoneCreator } from './model/stone';

(async () => {
  try {
    const board = new Board();
    const io = new IO(prompt);

    const othello = new Othello(board, new StoneCreator, new PlayerCreator, io);
    othello.start();
  } catch (e) {
    const _e = e as Error;
    console.error(_e.message);
  }
})();
