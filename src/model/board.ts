import { IStone, Stone, StoneState } from './stone';

export interface Coodinate {
  x: number;
  y: number;
}


export interface IBoard {
  size: number;
  state: IStone[][];
  putStone: (coodinate: Coodinate, state: StoneState) => void;
  getStone: (coodinate: Coodinate) => IStone;
  init: (number: number) => void;
}

export class Board {
  private _state: IStone[][] = [];
  private _size?: number;

  get size () {
    return this._size ?? 0
  }

  public init = (size: number) => {
    if (!this.isBoardSizeValid(size)) {
      throw new Error('サイズは4以上8以下の偶数です');
    }

    this._size = size;
    const state: IStone[][] = [];
    for (let y = 0; y < size; y++) {
      const row: IStone[] = [];
      for (let x = 0; x < size; x++) {
        row.push(new Stone());
      }
      state.push(row);
    }

    const base = size / 2 - 1;

    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        if (x === y) {
          state[y + base][x + base].state = 'black';
        } else {
          state[y + base][x + base].state = 'white';
        }
      }
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

  private existStone = (coodinate: Coodinate) => {
    if (!this._state || !this._state[coodinate.y] || !this._state[coodinate.y][coodinate.x]) {
      return false;
    }

    return true;
  };

  public putStone = (coodinate: Coodinate, state: StoneState) => {
    if (!this.existStone(coodinate)) {
      throw new Error('置けないよ');
    }

    this._state[coodinate.y][coodinate.x].state = state;
  };

  public getStone = (coodinate: Coodinate) => {
    if (!this.existStone(coodinate)) {
      throw new Error('ないよ');
    }

    return this._state[coodinate.y][coodinate.x];
  };
}
