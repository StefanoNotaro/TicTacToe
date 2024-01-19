import { Component, OnInit } from '@angular/core';
import { ISquare } from '../common/interfaces/square.interface';
import { Player } from '../common/enums/player.enum';
import { Difficulty } from '../common/enums/difficulty.enum';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  public squares!: ISquare[];
  public gameEnded = false;
  public xIsNext!: boolean;
  public winner!: string;
  public difficulty = Difficulty.Medium;
  private readonly winnerLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  public get getPlayer(): Player { return this.xIsNext ? Player.X : Player.O; }

  constructor() { }

  ngOnInit(): void {
    this.startNewGame();
  }

  public startNewGame(): void {
    this.squares = new Array<ISquare>(9)
      .fill({ disabled: false, index: 0 })
      .map((_, index) => ({ disabled: false, index }));
    this.xIsNext = false;
    this.winner = '';
  }

  public makeMove(index: number): void {
    if (!this.squares[index].value) {
      this.squares.splice(index, 1, { disabled: true, value: this.getPlayer, index });
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();
    if (this.winner === '' && this.xIsNext && this.squares.some(x => !x.value)) {
      this.makeAutomaticMove();
      this.winner = this.calculateWinner();
    }

  }

  private makeAutomaticMove(): void {
    this.makeMove(this.getNextMovementPosition());
  }

  private getNextMovementPosition(): number {
    if (this.difficulty === Difficulty.Easy) {
      return this.getRandomEmptySquare();
    }

    return this.getBlockingPosition();
  }

  private getBlockingPosition(): number {
    const opponentPositions = this.squares.filter(x => x.value === (this.xIsNext ? Player.O : Player.X));
    const opponentPositionsIndexes = opponentPositions.map(x => x.index);

    const lineToBlock = this.winnerLines.find(x => {
      const possibleMovement = x.filter(y => opponentPositionsIndexes.indexOf(y) !== -1);
      return possibleMovement?.length === 2 && x.some(y => !this.squares[y].value);
    });

    const blockingPosition = lineToBlock?.find(x => !this.squares[x]?.value) ?? -1;

    if (blockingPosition !== -1) {
      return blockingPosition;
    }

    return this.getRandomEmptySquare();
  }

  private getRandomEmptySquare(): number {
    const emptySquares = this.getEmptyPositions();
    return emptySquares[Math.floor(Math.random() * emptySquares.length)].index;
  }

  private getEmptyPositions(): ISquare[] {
    return this.squares.filter(x => !x.value);
  }

  private calculateWinner(): string {
    this.gameEnded = this.squares.filter(x => !x.disabled).length === 0;
    for (const iterator of this.winnerLines) {
      const [a, b, c] = iterator;
      if (this.squares[a].value &&
        this.squares[a].value === this.squares[b].value &&
        this.squares[a].value === this.squares[c].value) {
        this.gameEnded = true;
        this.disableSquares();
        return this.squares[a].value as Player;
      }
    }

    return '';
  }

  private disableSquares(): void {
    this.squares.forEach(x => x.disabled = true);
  }
}
