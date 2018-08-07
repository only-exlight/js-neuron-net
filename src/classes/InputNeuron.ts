export class InputNeuron {
    private links: Array<any> = [];
    private min: number;
    private max: number;
    private normOutSignal = 0;

    constructor(min: number, max: number) {
        this.links = [];
        this.min = min;
        this.max = max;
        this.normOutSignal = 0;
    }

    normalize(value: number) {
        this.normOutSignal = (value - this.min) / (this.max - this.min);
    }

    getSignal(signal: number) {
        this.normalize(signal);
    }
}