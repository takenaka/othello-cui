import { PlayerColor } from './player';

export type StoneState = PlayerColor | null;

export interface IStone {
  state: StoneState;
  flip: () => void;
}

export class Stone implements IStone {
  private _state: StoneState = null;

  get state() {
    return this._state;
  }

  set state(c: StoneState) {
    this._state = c;
  }

  public flip = () => {
    this._state = this._state === 'black' ? 'white' : 'black';
  };
}
