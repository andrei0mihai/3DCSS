import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeYearsChartComponent } from './three-years-chart.component';

describe('ThreeYearsChartComponent', () => {
  let component: ThreeYearsChartComponent;
  let fixture: ComponentFixture<ThreeYearsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeYearsChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeYearsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
