import { Component, OnInit } from '@angular/core';
import { ISquare } from '../common/square.interface';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  public squares!: ISquare[];
  public xIsNext!: boolean;
  public winner!: string;

  public get getPlayer(): 'X' | 'O' { return this.xIsNext ? 'X' : 'O'; }

  constructor() { }

  ngOnInit() {
    this.startNewGame();
  }
  public startNewGame(): void {
    this.squares = new Array<ISquare>(9).fill({ disabled: false, value: undefined });
    this.xIsNext = false;
    this.winner = '';
  }

  public makeMove(index: number): void {
    if (!this.squares[index].value) {
      this.squares.splice(index, 1, { disabled: true, value: this.getPlayer });
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();
  }
  private calculateWinner(): string {
    const winnerLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const iterator of winnerLines) {
      const [a, b, c] = iterator;
      if (this.squares[a].value &&
        this.squares[a].value === this.squares[b].value &&
        this.squares[a].value === this.squares[c].value) {
        return this.squares[a].value as string;
      }
    }

    return '';
  }

}
