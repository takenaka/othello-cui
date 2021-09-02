export type StoneState = 'white' | 'black' | null;

export interface IStone {
  state: StoneState;
}

export class Stone implements IStone {
  private _state: StoneState = null;

  get state() {
    return this._state;
  }

  set state(c: StoneState) {
    this._state = c;
  }
}
