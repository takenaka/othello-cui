import { IStone, Stone } from './stone';

export class Board {
  private _state: IStone[][] = [];

  constructor(size: number) {
    if (!this.isBoardSizeValid(size)) {
      throw new Error('サイズは4以上8以下の偶数です');
    }

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
  }

  get state() {
    return this._state;
  }

  private isBoardSizeValid = (size: number) => {
    if (size  >= 4 && size <= 8  && size % 2 === 0) {
      return true;
    }

    return false
  }
}
