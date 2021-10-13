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

export interface IPlayerCreator {
  factory: (color: StoneState, name: string) => IPlayer
}

export const PlayerCreator: IPlayerCreator = class PlayerCreator {
  public static factory = (color: StoneState, name: string) => {
    return new Player(color, name);
  }
}
