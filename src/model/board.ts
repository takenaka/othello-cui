import { IStone, StoneState } from './stone';

export interface Coodinate {
  x: number;
  y: number;
}

export interface IBoard {
  size: number;
  state: Array<IStone | null>[];
  putStone: (coodinate: Coodinate, stone: IStone) => void;
  canPutStone: (coodinate: Coodinate) => boolean;
  getStone: (coodinate: Coodinate) => IStone | null;
  countStone: (state: StoneState) => number;
  init: (number: number) => void;
}

export class Board implements IBoard {
  private _state: Array<IStone | null>[] = [];
  private _size?: number;

  get size() {
    return this._size ?? 0;
  }

  public init = (size: number) => {
    if (!this.isBoardSizeValid(size)) {
      throw new Error('サイズは4以上8以下の偶数です');
    }

    this._size = size;
    const state: null[][] = [];
    for (let y = 0; y < size; y++) {
      const row: null[] = [];
      for (let x = 0; x < size; x++) {
        row.push(null);
      }
      state.push(row);
    }

    this._state = state;
  };

  get state() {
    return this._state;
  }

  private isBoardSizeValid = (size: number) => {
    if (size >= 4 && size <= 8 && size % 2 === 0) {
      return true;
    }

    return false;
  };

  public canPutStone = (coodinate: Coodinate) => {
    return this.existSpace(coodinate) && !Boolean(this._state[coodinate.y][coodinate.x]);
  };

  private existSpace = (coodinate: Coodinate) => {
    // 範囲外
    if (this._state[coodinate.y] === undefined || this._state[coodinate.y][coodinate.x] === undefined) {
      return false;
    }

    return true;
  };

  public putStone = (coodinate: Coodinate, stone: IStone) => {
    if (!this.existSpace(coodinate) || !this.canPutStone(coodinate)) {
      throw new Error('置けないよ');
    }

    this._state[coodinate.y][coodinate.x] = stone;
  };

  public getStone = (coodinate: Coodinate) => {
    if (!this.existSpace(coodinate)) {
      throw new Error('範囲外だよ');
    }

    return this._state[coodinate.y][coodinate.x];
  };

  public countStone = (state: StoneState) => {
    let count = 0;
    this.state.forEach(y => {
      y.forEach(stone => {
        if (stone && stone.state === state) {
          count++;
        }
      });
    });

    return count;
  };
}
