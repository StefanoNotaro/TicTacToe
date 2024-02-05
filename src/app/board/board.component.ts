import {Component, OnInit} from '@angular/core';
import {ISquare} from '../common/interfaces/square.interface';
import {Player} from '../common/enums/player.enum';
import {Difficulty} from '../common/enums/difficulty.enum';
import {IDifficulty} from '../common/interfaces/difficulty.interface';

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
  public difficulties: IDifficulty[] = [];
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

  public get getSelectedDifficulty(): Difficulty { return this.difficulties.find(x => x.isSelected)?.difficulty ?? Difficulty.Easy; }
  public get getPlayer(): Player { return this.xIsNext ? Player.X : Player.O; }
  public get getGameStarted(): boolean { return this.squares.some(x => x.value !== undefined); }

  constructor() {
  }

  ngOnInit(): void {
    this.startNewGame();
    this.difficulties = Object.keys(Difficulty).map(key => {
      return {
        difficulty: key as Difficulty,
        isSelected: key === Difficulty.Easy
      };
    });
  }

  public startNewGame(): void {
    this.squares = new Array<ISquare>(9)
      .fill({disabled: false, index: 0})
      .map((_, index) => ({disabled: false, index}));
    this.xIsNext = false;
    this.winner = '';
  }

  public makeMove(index: number): void {
    if (!this.squares[index].value) {
      this.squares.splice(index, 1, {disabled: true, value: this.getPlayer, index});
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
    return  this.shouldUseRandomMove() ? this.getRandomEmptySquare() : this.getBlockingPosition();
  }

  private shouldUseRandomMove(): boolean {
    switch (this.getSelectedDifficulty) {
      case Difficulty.Medium:
        return Math.random() > 0.25;
      case Difficulty.Hard:
        return false;
      case Difficulty.Easy:
      default:
        return true;
    }
  }

  private getBlockingPosition(): number {
    const mySquareCondition: (square: ISquare, player: Player) => boolean = (x, player) => {
      return x.value === player;
    };

    const myPositions = this.squares
      .filter(x => mySquareCondition(x, this.xIsNext ? Player.X : Player.O))
      .map(x => x.index);
    const myWinningLines = this.winnerLines.find(x => {
      const possibleMovement = x.filter(y => myPositions.indexOf(y) !== -1);
      return possibleMovement?.length === 2 && x.some(y => !this.squares[y].value);
    });

    const winningingPosition = myWinningLines?.find(x => !this.squares[x]?.value) ?? -1;
    if (winningingPosition !== -1) {
      return winningingPosition;
    }

    const opponentPositionsIndexes = this.squares
      .filter(x => mySquareCondition(x, this.xIsNext ? Player.O : Player.X))
      .map(x => x.index);

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

  public onDifficultyClick(difficulty: IDifficulty): void {
    if (!this.getGameStarted) {
      this.difficulties.forEach(x => x.isSelected = x.difficulty === difficulty.difficulty);
    }
  }
}
