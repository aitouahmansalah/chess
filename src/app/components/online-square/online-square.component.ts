
import { Component, Input, OnInit } from '@angular/core';

import { combineLatest, shareReplay } from 'rxjs';

import { GameService } from '../../services/game.service';
import { Colors } from '../../models/colors.enum';
import { Pieces } from '../../models/pieces.enum';
import { MoveActions } from '../../models/move.model';
import { squareNumber } from '../../utils/board';
import { OnlineGameService } from 'src/app/services/online-game.service';
@Component({
  selector: 'jv-online-square',
  templateUrl: './online-square.component.html',
  styleUrls: ['./online-square.component.scss']
})
export class OnlineSquareComponent implements OnInit {

  @Input() rank!: number;
  @Input() file!: number;

  square!: [Pieces, Colors] | undefined;
  isActive!: boolean;
  isSelected!: boolean;
  squareAction!: MoveActions | undefined;
  playerColor !: Colors;
  gameStarted:boolean = false;
  gameEnded:boolean = false;

  readonly moveActionsEnum = MoveActions;

  constructor(private gameService: OnlineGameService) {
  }

  ngOnInit(): void {
    this.gameService.gameStarted.subscribe(started =>{
        this.gameStarted = started;
        this.playerColor = this.gameService.playerColor;
    });

    this.gameService.gameEnded.subscribe(ended =>{
      this.gameEnded = ended;
    })
    
    const piece$ = this.gameService.getPieceInSquare$(this.rank, this.file)
      .pipe(shareReplay());

    piece$
      .subscribe(square => this.square = square);

    combineLatest([
      piece$,
      this.gameService.activeColor$,
    ])
      .subscribe(([square, active]) => {this.isActive = (square?.[1] === this.playerColor) && (square?.[1] === active) 
          
      });

    this.gameService.selectedSquare$
      .subscribe(value => {
        if (!value) {
          this.isSelected = false;
        } else {
          this.isSelected = value.rank === this.rank
            && value.file === this.file;
        }
      });

    this.gameService.availableMoves$
      .subscribe(moves => {
        const move = moves
          .find(move => move.square === squareNumber(this.rank, this.file));

        this.squareAction = move?.action;
      });

      
  }

  get isSelectable(): boolean {
    return (this.isActive || !!this.squareAction ) && this.gameStarted && !this.gameEnded && (this.gameService.index.value == this.gameService.gameStateSubject.value.history.length - 1);
  }

  get imgSrc(): string | null {
    if (!this.square) {
      return null;
    }

    const piece = this.square[0].toLowerCase();
    const color = this.square[1].toLowerCase();

    return `assets/icons/pieces/${ piece }-${ color }.svg`;
  }

  get imgAlt(): string | null {
    if (!this.square) {
      return null;
    }

    const [piece, color] = this.square;

    return `${ piece } ${ color }`;
  }

  get isCapture(): boolean {
    return this.squareAction === MoveActions.Capture
      || this.squareAction === MoveActions.EnPassant;
  }

  get isMove(): boolean {
    return this.squareAction === MoveActions.Move
      || this.squareAction === MoveActions.ShortCastle
      || this.squareAction === MoveActions.LongCastle;
  }

  onSquareClick(): void {
    if((this.square?.[1] == this.playerColor || this.squareAction) && !this.gameEnded && (this.gameService.index.value == this.gameService.gameStateSubject.value.history.length - 1))
    this.gameService.selectSquare(this.rank, this.file);
  }

}
