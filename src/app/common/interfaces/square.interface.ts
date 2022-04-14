import { Player } from '../enums/player.enum';

export interface ISquare {
  index: number;
  disabled: boolean;
  value?: Player;
}
