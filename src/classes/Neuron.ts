import { NeuronLink } from '../interfaces/NeuronLink.interface';
import { Neuron } from '../interfaces/Neuron.interface';

export class HideNeuron implements Neuron {
    private links: NeuronLink[] = [];
    private inputSignals: number[] = [];
    public activated: Function;
    private outSignal: number;
    private min = 0;
    private max = 1;

    //
    public delta: number;

    constructor(inputCount: number, actFunc: Function) {
        this.links = [];
        this.activated = actFunc;
    }

    get signal(): number {
        const sumSignal = this.sumed(this.inputSignals);
        this.outSignal = this.activated(sumSignal);
        return this.outSignal;
    }

    get outLinks(): NeuronLink[] {
        return this.links;
    }

    public addLink(link: NeuronLink) {
        this.links.push(link);
    }

    public addInputSignal(val: number) {
        this.inputSignals.push(val);
    }

    public changeInputSignal(val:number, i: number): void {
        this.inputSignals[i] = val;
    }

    private sumed(values: number[]) {
        let sum = 0;
        values.forEach(v => sum += v);
        return sum;
    }
}
