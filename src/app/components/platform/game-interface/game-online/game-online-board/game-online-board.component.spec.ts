import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOnlineBoardComponent } from './game-online-board.component';

describe('GameOnlineBoardComponent', () => {
  let component: GameOnlineBoardComponent;
  let fixture: ComponentFixture<GameOnlineBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameOnlineBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameOnlineBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
