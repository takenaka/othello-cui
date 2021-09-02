import inquirer from 'inquirer';
import { IBoard } from './board';
import { IPlayer } from './player';

export class Othello {
  private readonly board: IBoard;
  private readonly player1: IPlayer;
  private readonly player2: IPlayer;
  private turn: IPlayer;

  constructor(board: IBoard, player1: IPlayer, player2: IPlayer) {
    this.board = board;
    this.player1 = player1;
    this.player2 = player2;

    this.turn = this.player1;
  }

  public init = async () => {
    const prompt = inquirer.createPromptModule();
    const answer = await prompt({
      message: 'ボードのサイズを選択してください',
      name: 'boardSize',
      type: 'list',
      choices: [
        { name: '4 x 4', value: 4 },
        { name: '6 x 6', value: 6 },
        { name: '8 x 8', value: 8 },
      ],
    });
    this.board.init(answer.boardSize);

    console.log(`先行は${this.turn.name}です`);
  };
}
