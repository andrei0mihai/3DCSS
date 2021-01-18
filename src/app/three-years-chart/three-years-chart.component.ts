import { Component, ElementRef, HostListener, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ThreeYearsChartDisplayModel } from './three-years-chart-display-model';
import { ThreeYearsChartInput } from './three-years-chart-input';

@Component({
  providers: [{ provide: Window, useValue: window }],
  selector: 'app-three-years-chart', styleUrls: ['./three-years-chart.component.scss'],
  templateUrl: './three-years-chart.component.html'
})
export class ThreeYearsChartComponent implements OnInit {
  @Input() input: ThreeYearsChartInput[] = [];
  @ViewChildren('columns') columns: QueryList<ElementRef> = {} as QueryList<ElementRef>;

  displayModel: ThreeYearsChartDisplayModel[] = [];

  constructor(private elementRef: ElementRef, private window: Window) { }

  @HostListener('mouseover') onMouseOver(): void {
    const nativeElement = this.elementRef.nativeElement as HTMLElement;

    this.columns.forEach((column: ElementRef, index: number) => {
      const height = this.getAfterCSSStyle(column.nativeElement).height;

      if (height !== 'auto') {
        let tooltipBottom = 0;

        if (this.displayModel[index].bottom + parseInt(height, 10) > nativeElement.offsetHeight * 0.9) {
          tooltipBottom = this.displayModel[index].bottom - 2 * parseInt(height, 10);
        } else {
          tooltipBottom = this.displayModel[index].bottom + parseInt(height, 10);
        }

        column.nativeElement.style.setProperty('--tooltipBottom', `${tooltipBottom}`);
      }
    }
    );
  }

  @HostListener('window:resize') onResize(): void {
    const nativeElement = this.elementRef.nativeElement as HTMLElement;
    const ratio = Math.max(nativeElement.offsetHeight / nativeElement.offsetWidth, nativeElement.offsetWidth / nativeElement.offsetHeight);

    this.displayModel = this.generateDisplayModel(this.input, nativeElement.offsetHeight, nativeElement.offsetWidth);

    nativeElement.style.setProperty('--middleOfColumnWidth', `${nativeElement.offsetWidth / this.input.length / 2}px`);
    nativeElement.style.setProperty('--height', `${nativeElement.offsetHeight}`);
    nativeElement.style.setProperty('--ratio', `${ratio}`);
    nativeElement.style.setProperty('--width', `${nativeElement.offsetWidth}`);
  }

  ngOnInit(): void {
    this.onResize();
  }

  getAfterCSSStyle(element: Element): CSSStyleDeclaration {
    return this.window.getComputedStyle(element, ':after');
  }

  /**
   * divide chart size by total number of points to get length of triangle base. That becomes the left offset for each new point
   * subtract previous point height from new point height to get the rise of the triangle.
   * That becomes the bottom offset for the new point.
   * use base squared + rise squared to find the length of the hypotenuse. That becomes the width of the line to draw.
   * use Math.asin(base / hypotenuse) [then convert the radians to degrees] to find the degree angle to rotate the line to.
   * Multiply the rotation angle by -1 if it needs to rise to meet the next point.
   *
   * @private
   * @param values ex.: [{value:-3.5,year:1999},{value:-3.5,year:1999}]
   * @param  widgetHeight
   * @param  widgetWidth
   * @return ex.: [{angle:12,bottom:24,hypotenuse:42,left:54,value:-3.5,year:1999}]
   * @memberof ThreeYearsChartComponent
   */
  private generateDisplayModel(values: ThreeYearsChartInput[], widgetHeight: number, widgetWidth: number): ThreeYearsChartDisplayModel[] {
    const base = widgetWidth / values.length;
    const displayModel: ThreeYearsChartDisplayModel[] = [];
    const mapValues = (difference: number = 0) => values.map(value => value.value - difference);
    const valueArray = values.map(entry => entry.value);
    const bottomMostPoint = Math.min(...valueArray);
    const topMostPoint = Math.max(...valueArray);
    let fixedNegativeValues = [];
    let leftOffset = base / 2;
    let padding = widgetHeight * 0.05;
    let chartHeight = widgetHeight * 0.9 - padding;
    let rise = 0;

    if (bottomMostPoint < 0) {
      fixedNegativeValues = mapValues(bottomMostPoint);
      chartHeight -= 2 * padding;
    } else {
      fixedNegativeValues = mapValues();
      padding = 0;
    }

    for (let i = 0; i < values.length - 1; i++) {
      const currentValue = new ThreeYearsChartDisplayModel(0, 0, 0, 0, values[i].value, values[i].year);
      currentValue.bottom = chartHeight * fixedNegativeValues[i] / topMostPoint + padding;
      currentValue.left = leftOffset;
      leftOffset += base;
      rise = currentValue.bottom - chartHeight * fixedNegativeValues[i + 1] / topMostPoint - padding;
      currentValue.hypotenuse = Math.sqrt(base * base + rise * rise);
      currentValue.angle = Math.asin(rise / currentValue.hypotenuse) * 180 / Math.PI;
      displayModel.push(currentValue);
    }

    displayModel.push(new ThreeYearsChartDisplayModel(0, chartHeight * fixedNegativeValues[values.length - 1] / topMostPoint + padding, 0,
      leftOffset, values[values.length - 1].value, values[values.length - 1].year));

    return displayModel;
  }
}
