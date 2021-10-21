import { Coodinate, IBoard } from './board';
import { IIO } from './io';
import { IPlayer, IPlayerCreator } from './player';
import { IStoneCreator } from './stone';

export type Direction = 1 | -1 | 0;

export interface XYDirection {
  y: Direction;
  x: Direction;
}

const directions: XYDirection[] = [
  { y: -1, x: 0 },
  { y: -1, x: 1 },
  { y: 0, x: 1 },
  { y: 1, x: 1 },
  { y: 1, x: 0 },
  { y: 1, x: -1 },
  { y: 0, x: -1 },
  { y: -1, x: -1 },
];

export class Othello {
  private readonly board: IBoard;
  private readonly stoneCreator: IStoneCreator;
  private readonly player1: IPlayer;
  private readonly player2: IPlayer;
  private readonly io: IIO;
  private currentPlayer: IPlayer;
  private passedCount = 0;

  constructor(board: IBoard, stoneCreator: IStoneCreator, playerCreator: IPlayerCreator, io: IIO) {
    this.board = board;
    this.stoneCreator = stoneCreator;
    this.player1 = playerCreator.factory('black', '黒');
    this.player2 = playerCreator.factory('white', '白');
    this.io = io;

    this.currentPlayer = this.player1;
  }

  public start = async () => {
    try {
      // 初期盤面の生成
      const size = await this.io.selectBoardSize();
      this.setInitialBoard(size);

      this.io.showMessage(`先行は${this.currentPlayer.name}です`);

      // 2連続パスか盤面が一杯になるまで
      while (this.passedCount < 2 && !this.board.isFull()) {
        await this.playTurn();
        this.changeTurn();
      }

      this.end();
    } catch (e) {
      const _e = e as Error;
      this.io.showMessage(_e.message);
    }
  };

  private setInitialBoard = (size: number) => {
    this.board.init(size);

    const base = size / 2 - 1;

    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        if (x === y) {
          this.board.putStone({ y: y + base, x: x + base }, this.stoneCreator.factory('black'));
        } else {
          this.board.putStone({ y: y + base, x: x + base }, this.stoneCreator.factory('white'));
        }
      }
    }
  };

  private putStone = (coodinate: Coodinate) => {
    const flippableStones = this.getFlipableStoneCoodinates(coodinate);

    if (flippableStones.length === 0) {
      throw new Error('ひっくり返せる石がないよ');
    }

    this.board.putStone(coodinate, this.stoneCreator.factory(this.currentPlayer.color));
    flippableStones.forEach(flipableStone => {
      const stone = this.board.getStone(flipableStone);
      stone?.flip();
    });
  };

  private changeTurn = () => {
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
  };

  private playTurn = async () => {
    this.io.showBoard(this.board);
    this.io.showMessage(`${this.currentPlayer.name}の番`);

    if (!this.canPutStone()) {
      // 置く場所がない場合
      this.passedCount++;

      this.io.showMessage(`${this.currentPlayer.name}は置けないのでパス`);
      return;
    }

    this.passedCount = 0;

    // 置けるまで聞く
    while (true) {
      try {
        const coodinate = await this.io.selectXYCoodinate(this.board);
        this.putStone(coodinate);
        break;
      } catch (e) {
        const _e = e as Error;
        console.log(`\n${_e.message}\n`);
      }
    }
  };

  // 置ける場所があるかどうか
  private canPutStone = () => {
    // 全部のマスを調べて置ける場所があるかどうか調べる
    for (let i = 0; i < this.board.size; i++) {
      for (let j = 0; j < this.board.size; j++) {
        if (!this.board.isEmpty({ y: i, x: j })) {
          continue;
        }
        const flippableStones = this.getFlipableStoneCoodinates({ y: i, x: j });
        if (flippableStones.length > 0) {
          return true;
        }
      }
    }

    return false;
  };

  // 全方向を見て裏返せる石を探す
  private getFlipableStoneCoodinates = (coodinate: Coodinate) => {
    let coodinates: Coodinate[] = [];

    directions.forEach(direction => {
      const value = this.getFlipableStoneCoodinatesLookAtSingleDirection(coodinate, direction);
      coodinates = coodinates.concat(value);
    });

    return coodinates;
  };

  // 一方向を見て裏返せる石を探す
  private getFlipableStoneCoodinatesLookAtSingleDirection = (cordinate: Coodinate, direction: XYDirection) => {
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
      if (!boardMapCoordinate) {
        return [];
      }

      //自分の石があったならcoodinatesを返す
      if (boardMapCoordinate.state === this.currentPlayer.color) {
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

  private end = () => {
    this.io.showBoard(this.board);

    const player1Count = this.board.countStone(this.player1.color);
    const player2Count = this.board.countStone(this.player2.color);

    this.io.showMessage(`${this.player1.name}: ${player1Count}`);
    this.io.showMessage(`${this.player2.name}: ${player2Count}`);

    let winner = player1Count > player2Count ? this.player1.name : this.player2.name;
    if (player1Count === player2Count) {
      winner = 'なし';
    }

    this.io.showMessage(`勝者は: ${winner}`);
    this.io.showMessage('\nゲーム終了');
  };
}
