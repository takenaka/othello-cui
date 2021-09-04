export type PlayerColor = 'white' | 'black';

export interface IPlayer {
  color: PlayerColor;
  name: string;
}

export class Player implements IPlayer {
  readonly color: PlayerColor;
  readonly name: string;

  constructor(color: PlayerColor, name: string) {
    this.color = color;
    this.name = name;
  }
}
