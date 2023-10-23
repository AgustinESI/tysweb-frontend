import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourInLineComponent } from './four-in-line.component';

describe('FourInLineComponent', () => {
  let component: FourInLineComponent;
  let fixture: ComponentFixture<FourInLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourInLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourInLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
