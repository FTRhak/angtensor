import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecognizeNumberTrainComponent } from './recognize-number-train.component';

describe('RecognizeNumberTrainComponent', () => {
  let component: RecognizeNumberTrainComponent;
  let fixture: ComponentFixture<RecognizeNumberTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecognizeNumberTrainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecognizeNumberTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
