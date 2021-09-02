export type PlayerColor = 'white' | 'black';

export interface IPlayer {
  color: PlayerColor;
  name: string;
  turn: () => void;
}

export class Player implements IPlayer {
  readonly color: PlayerColor;
  readonly name: string;

  constructor(color: PlayerColor, name: string) {
    this.color = color;
    this.name = name;
  }

  public turn = () => {
    return;
  };
}
