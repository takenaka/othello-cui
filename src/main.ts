import { prompt } from 'inquirer';
import { Board } from './model/board';
import { IO } from './model/io';
import { Othello } from './model/othello';
import { PlayerCreator } from './model/player';
import { StoneCreator } from './model/stone';

const othello = new Othello(new Board(), new StoneCreator(), new PlayerCreator(), new IO(prompt));
othello.start();
