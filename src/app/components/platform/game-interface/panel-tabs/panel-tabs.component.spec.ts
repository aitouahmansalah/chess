import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelTabsComponent } from './panel-tabs.component';

describe('PanelTabsComponent', () => {
  let component: PanelTabsComponent;
  let fixture: ComponentFixture<PanelTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
