import { ThreeYearsChartTooltipModel } from './three-years-chart-tooltip-model';
export class ThreeYearsChartDisplayModel {
    angle: number;
    bottom: number;
    hypotenuse: number;
    left: number;
    tooltip: ThreeYearsChartTooltipModel;
    value: number;
    year: number;

    constructor(angle: number, bottom: number, hypotenuse: number, left: number, value: number, year: number, tooltip?:
        ThreeYearsChartTooltipModel) {
        this.angle = angle;
        this.bottom = bottom;
        this.hypotenuse = hypotenuse;
        this.left = left;
        this.value = value;
        this.year = year;

        if (tooltip) {
            this.tooltip = new ThreeYearsChartTooltipModel(tooltip.bottom, tooltip.left);
        } else {
            this.tooltip = new ThreeYearsChartTooltipModel(0, 0);
        }
    }
}
