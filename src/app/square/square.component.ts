import { Component, Input } from '@angular/core';
import { Player } from '../common/enums/player.enum';
import { ISquare } from '../common/interfaces/square.interface';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() value!: ISquare;

  Player = Player;

  constructor() { }

}
