export class ThreeYearsChartInput {
    positiveValue?: number;
    value: number;
    year: number;

    constructor(value: number, year: number) {
        this.value = value;
        this.year = year;
    }
}
