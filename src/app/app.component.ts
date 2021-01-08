import { Component } from '@angular/core';
import { ThreeYearsChartInput } from './three-years-chart/three-years-chart-input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  threeYearsChartInput: ThreeYearsChartInput[];

  constructor() {
    this.threeYearsChartInput = [new ThreeYearsChartInput(0.63, 2018), new ThreeYearsChartInput(0.58, 2019),
    new ThreeYearsChartInput(-0.16, 2020), new ThreeYearsChartInput(2.76, 2021)];
  }
}
