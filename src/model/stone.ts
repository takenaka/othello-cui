export type StoneState = 'white' | 'black';

export interface IStone {
  state: StoneState;
  flip: () => void;
}

export class Stone implements IStone {
  private _state: StoneState;

  constructor(value: StoneState) {
    this._state = value;
  }

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

export interface IStoneCreator {
  factory: (value: StoneState) => IStone;
}

export class StoneCreator implements IStoneCreator {
  public factory = (value: StoneState) => {
    return new Stone(value);
  };
};
