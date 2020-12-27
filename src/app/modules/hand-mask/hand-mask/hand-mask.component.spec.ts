import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandMaskComponent } from './hand-mask.component';

describe('HandMaskComponent', () => {
  let component: HandMaskComponent;
  let fixture: ComponentFixture<HandMaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandMaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
