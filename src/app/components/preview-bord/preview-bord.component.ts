import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jv-preview-bord',
  templateUrl: './preview-bord.component.html',
  styleUrls: ['./preview-bord.component.scss']
})
export class PreviewBordComponent implements OnInit {

  readonly boardDirectionArray = new Array(8).fill(0).map((_, i) => i + 1);

  constructor() { }

  ngOnInit(): void {
  }

}
