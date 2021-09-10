export type StoneColor = 'white' | 'black';

export type StoneState = StoneColor | null;

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
    if (this._state === null) {
      throw new Error('ひっくり返せないよ')
    }

    this._state = this._state === 'black' ? 'white' : 'black';
  };
}

export interface IStoneFactory {
  factory: () => IStone;
}

export const StoneFactory: IStoneFactory = class StoneFactory {
  public static factory = () => {
    return new Stone();
  };
};
