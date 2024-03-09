import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jv-online-board',
  templateUrl: './online-board.component.html',
  styleUrls: ['./online-board.component.scss']
})
export class OnlineBoardComponent implements OnInit {

  readonly boardDirectionArray = new Array(8).fill(0).map((_, i) => i + 1);

  constructor() { }

  ngOnInit(): void {
    console.log(this.boardDirectionArray)
  }

}
