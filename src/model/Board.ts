import { IStone, Stone } from './Stone';

export class Board {
  private _state: IStone[][] = [];

  constructor(size: number) {
    const checkedSize = Board.checkBoardSize(size);

    const state: IStone[][] = [];
    for (let y = 0; y < checkedSize; y++) {
      const row: IStone[] = [];
      for (let x = 0; x < checkedSize; x++) {
        row.push(new Stone());
      }
      state.push(row);
    }

    const base = checkedSize / 2 - 1;

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

  static checkBoardSize = (size: number) => {
    if (size  >= 4 && size <= 8  && !(size % 2)) {
      return size;
    }

    throw new Error('サイズは4以上8以下の偶数です');
  }
}
