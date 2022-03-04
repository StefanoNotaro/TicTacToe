import { Component, Input } from '@angular/core';
import { ISquare } from '../common/square.interface';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() value!: ISquare;

  constructor() { }

}
