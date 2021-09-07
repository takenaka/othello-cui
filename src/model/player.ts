import { StoneColor } from './stone';

export interface IPlayer {
  color: StoneColor;
  name: string;
}

export class Player implements IPlayer {
  readonly color: StoneColor;
  readonly name: string;

  constructor(color: StoneColor, name: string) {
    this.color = color;
    this.name = name;
  }
}
