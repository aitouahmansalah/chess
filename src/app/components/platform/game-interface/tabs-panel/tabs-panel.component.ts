import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { PlayTabModule } from './play-tab/play-tab.module';

@Component({
  selector: 'jv-tabs-panel',
  templateUrl: './tabs-panel.component.html',
  styleUrls: ['./tabs-panel.component.scss'],
  standalone: true,
  imports: [MatTabsModule,MatIconModule,PlayTabModule],
})
export class TabsPanelComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {}

}
