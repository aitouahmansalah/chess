import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayTabComponent } from './play-tab.component';

describe('PlayTabComponent', () => {
  let component: PlayTabComponent;
  let fixture: ComponentFixture<PlayTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayTabComponent ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
