import { Player } from '../enums/player';

export interface ISquare {
  disabled: boolean;
  value: Player | undefined;
}
