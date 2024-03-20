import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, shareReplay } from 'rxjs';
import { Colors } from 'src/app/models/colors.enum';
import { MoveActions } from 'src/app/models/move.model';
import { Pieces } from 'src/app/models/pieces.enum';
import { GameService } from 'src/app/services/game.service';
import { PreviewService } from 'src/app/services/preview.service';

@Component({
  selector: 'jv-preview-square',
  templateUrl: './preview-square.component.html',
  styleUrls: ['./preview-square.component.scss']
})
export class PreviewSquareComponent implements OnInit {

  @Input() rank!: number;
  @Input() file!: number;

  square!: [Pieces, Colors] | undefined;
  isActive!: boolean;
  isSelected!: boolean;
  squareAction!: MoveActions | undefined;

  readonly moveActionsEnum = MoveActions;

  constructor(private gameService: PreviewService) {
  }

  ngOnInit(): void {
    const piece$ = this.gameService.getPieceInSquare$(this.rank, this.file)
      .pipe(shareReplay());

    piece$
      .subscribe(square => this.square = square);

    combineLatest([
      piece$,
      this.gameService.activeColor$,
    ])
      .subscribe(([square, active]) => this.isActive = square?.[1] === active);

  
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



}
