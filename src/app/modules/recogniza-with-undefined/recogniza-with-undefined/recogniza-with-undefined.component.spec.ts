import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecognizaWithUndefinedComponent } from './recogniza-with-undefined.component';

describe('RecognizaWithUndefinedComponent', () => {
  let component: RecognizaWithUndefinedComponent;
  let fixture: ComponentFixture<RecognizaWithUndefinedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecognizaWithUndefinedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecognizaWithUndefinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
