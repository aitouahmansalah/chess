import { NgModule } from '@angular/core';
import { PlayTabComponent } from './play-tab.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports:[MatIconModule],
  declarations: [PlayTabComponent],
  exports: [PlayTabComponent],
})
export class PlayTabModule {}
