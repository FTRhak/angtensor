import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecognizeByConvComponent } from './recognize-by-conv.component';

describe('RecognizeByConvComponent', () => {
  let component: RecognizeByConvComponent;
  let fixture: ComponentFixture<RecognizeByConvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecognizeByConvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecognizeByConvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
