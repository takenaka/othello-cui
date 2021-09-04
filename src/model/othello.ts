import { prompt } from '../utils/prompt';
import { Coodinate, IBoard } from './board';
import { IIO } from './io';
import { IPlayer, PlayerColor } from './player';

export type Direction = 1 | -1 | 0;

export interface DirectionXY {
  y: Direction;
  x: Direction;
}

export class Othello {
  private readonly board: IBoard;
  private readonly player1: IPlayer;
  private readonly player2: IPlayer;
  private readonly io: IIO;
  private turnPlayer: IPlayer;
  private putCount = 0;
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

  constructor(board: IBoard, player1: IPlayer, player2: IPlayer, io: IIO) {
    this.board = board;
    this.player1 = player1;
    this.player2 = player2;
    this.io = io;

    this.turnPlayer = this.player1;
  }

  public init = async () => {
    try {
      const answer = await this.io.selectBoardSize();
      this.board.init(answer);

      this.io.message(`先行は${this.turnPlayer.name}です`);

      while (this.pass < 2 || this.putCount < this.board.size ** 2) {
        console.log(this.putCount, this.board.size ** 2);
        await this.changeTurn();
      }

      this.end();
    } catch (e) {
      this.io.message(e.message);
    }
  };

  private putStone = (coodinate: Coodinate) => {
    const flipableStones = this.getFlipableStonesCoodinate(coodinate);

    if (flipableStones.length === 0) {
      throw new Error('ひっくり返せる石がないよ');
    }

    this.board.putStone(coodinate, this.turnPlayer.color);
    flipableStones.forEach(flipableStone => {
      this.board.getStone(flipableStone).flip();
    });
  };

  private changeTurn = async () => {
    if (this.putCount !== 0) {
      this.turnPlayer = this.turnPlayer === this.player1 ? this.player2 : this.player1;
    }

    this.io.showBoard(this.board);

    this.io.message(`${this.turnPlayer.name}の番`);

    // 全部のマスを調べて置ける場所があるかどうか調べる
    for (let i = 0; i < this.board.size; i++) {
      for (let j = 0; j < this.board.size; j++) {
        if (!this.board.canPutStone({ y: i, x: j })) {
          continue;
        }

        const flipableStones = this.getFlipableStonesCoodinate({ y: i, x: j });

        // 置く場所があればターンを実行して終了
        if (flipableStones.length > 0) {
          this.pass = 0;
          const coodinate = await this.positionQuestion();
          this.putStone(coodinate);
          this.putCount++;
          return;
        }
      }
    }

    // 置く場所がない場合
    this.pass++;

    this.io.message(`${this.turnPlayer.name}は置けないのでパス`);
  };

  // 全方向を見て裏返せる石を探す
  private getFlipableStonesCoodinate = (coodinate: Coodinate) => {
    let coodinates: Coodinate[] = [];

    this.directions.forEach(direction => {
      const value = this.getFlipableStonesCoodinateLookAtSingleDirection(coodinate, direction);
      coodinates = coodinates.concat(value);
    });

    return coodinates;
  };

  // 一方向を見て裏返せる石を探す
  private getFlipableStonesCoodinateLookAtSingleDirection = (cordinate: Coodinate, direction: DirectionXY) => {
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
      if (boardMapCoordinate.state === this.turnPlayer.color) {
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
    const player1Count = this.getStoneCount(this.player1.color);
    const player2Count = this.getStoneCount(this.player2.color);

    this.io.message('おわり');

    this.io.message(`${this.player1.name}: ${player1Count}`);
    this.io.message(`${this.player2.name}: ${player2Count}`);

    let winner = player1Count > player2Count? this.player1.name: this.player2.name;
    if (player1Count === player2Count) {
      winner = 'なし'
    }

    this.io.message(`勝者は: ${winner}`)
  };

  private getStoneCount = (color: PlayerColor) => {
    let count = 0;
    this.board.state.forEach(y => {
      y.forEach(stone => {
        if (stone.state === color) {
          count++;
        }
      })
    })

    return count;
  }

  private positionQuestion = async (): Promise<Coodinate> => {
    const choices: { name: string; value: number }[] = [];
    for (let i = 0; i < this.board.size; i++) {
      choices.push({ name: (i + 1).toString(), value: i });
    }

    const x = await this.io.selectCoodinate('x', choices);
    const y = await this.io.selectCoodinate('y', choices);
    return { y, x };
  };
}
