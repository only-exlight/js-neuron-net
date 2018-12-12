import { NeuronLink } from '../interfaces/NeuronLink.interface';
import { Neuron } from '../interfaces/Neuron.interface';

export class OutputNeuron implements Neuron {
    private inputSignals: number[] = [];
    public activated: Function;
    private outSignal: number;
    //
    public delta: number;

    constructor(actFunc: Function) {
        this.activated = actFunc;
    }

    get signal(): number {
        const sumSignal = this.sumed(this.inputSignals);
        this.outSignal = this.activated(sumSignal);
        return this.outSignal;
    }

    get outLinks(): NeuronLink[] {
        return null;
    }

    public initFromData(neuron: any) {
        this.delta = neuron.delta;
    }

    public addInputSignal(val: number) {
        this.inputSignals.push(val);
    }

    public changeInputSignal(val: number, i: number ): void {
        this.inputSignals[i] = val;
    }

    public addLink () { }

    private sumed(values: number[]) {
        let sum = 0;
        values.forEach(v => sum += v);
        return sum;
    }
}