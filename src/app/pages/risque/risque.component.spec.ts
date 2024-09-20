import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisqueComponent } from './risque.component';

describe('RisqueComponent', () => {
  let component: RisqueComponent;
  let fixture: ComponentFixture<RisqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RisqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RisqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
