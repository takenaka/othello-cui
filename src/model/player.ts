import { StoneState } from './stone';

export interface IPlayer {
  color: StoneState;
  name: string;
}

export class Player implements IPlayer {
  readonly color: StoneState;
  readonly name: string;

  constructor(color: StoneState, name: string) {
    this.color = color;
    this.name = name;
  }
}
