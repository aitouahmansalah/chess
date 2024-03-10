import { Component, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'jv-tabs-panel',
  templateUrl: './tabs-panel.component.html',
  styleUrls: ['./tabs-panel.component.scss'],
  standalone: true,
  imports: [MatTabsModule],
})
export class TabsPanelComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {}

}
