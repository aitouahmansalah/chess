import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOnlineComponent } from './game-online.component';

describe('GameOnlineComponent', () => {
  let component: GameOnlineComponent;
  let fixture: ComponentFixture<GameOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameOnlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
