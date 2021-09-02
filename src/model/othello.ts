import inquirer from 'inquirer';
import { Coodinate, IBoard } from './board';
import { IPlayer } from './player';

export type Direction = 1 | -1 | 0;

export interface DirectionXY {
  y: Direction;
  x: Direction;
}

export class Othello {
  private readonly board: IBoard;
  private readonly player1: IPlayer;
  private readonly player2: IPlayer;
  private turn: IPlayer;
  private pass = 0;
  private directions: DirectionXY[] = [
    { y: -1, x: 0 },
    { y: -1, x: 1 },
    { y: 0, x: 1 },
    { y: 1, x: 1 },
    { y: 1, x: 0 },
    { y: 1, x: -1 },
    { y: 0, x: -1 },
    { y: -1, x: -1 },
  ];

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

    this.changeTurn();
  };

  private changeTurn = () => {
    this.turn = this.turn === this.player1 ? this.player2 : this.player1;

    // 全部のマスを調べて置ける場所があるかどうか調べる
    all:
    for (let i = 0; i < this.board.size; i++) {
      for (let j = 0; j < this.board.size; j++) {
        const flipableStones = this.getFlipableStones({ y: i, x: j });
        console.log(flipableStones);
        if (flipableStones.length > 0) {
          break all;
        }
      }
    }
  };

  // 全方向を見て裏返せる石を探す
  private getFlipableStones = (coodinate: Coodinate) => {
    let coodinates: Coodinate[] = [];

    this.directions.forEach(direction => {
      const value = this.getFlipableStonesLookAtSingleDirection(coodinate, direction);
      coodinates = coodinates.concat(value);
    });

    return coodinates;
  };

  // 一方向を見て裏返せる石を探す
  private getFlipableStonesLookAtSingleDirection = (cordinate: Coodinate, direction: DirectionXY) => {
    const coodinates: Coodinate[] = [];

    for (let i = 1; i <= this.board.size; i++) {
      const r = cordinate.y + direction.y * i;
      const c = cordinate.x + direction.x * i;

      try {
        this.board.getStone({ y: r, x: c });
      } catch {
        return [];
      }

      const boardMapCoordinate = this.board.getStone({ y: r, x: c });

      //空マスなら空の配列を返す。
      if (boardMapCoordinate.state === null) {
        return [];
      }

      //自分の石があったならcoodinatesを返す
      if (boardMapCoordinate.state === this.turn.color) {
        return coodinates;
      }

      //相手の石があればその座標をcoodinatesにプッシュする。
      coodinates.push({
        y: r,
        x: c,
      });
    }

    return coodinates;
  };
}
