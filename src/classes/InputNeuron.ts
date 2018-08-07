import { NeuronLink } from '../interfaces/NeuronLink.interface';
import { Neuron } from '../interfaces/Neuron.interface';

export class InputNeuron implements Neuron {
    private links: NeuronLink[] = [];
    private min: number;
    private max: number;
    private normOutSignal = 0;

    constructor(min: number, max: number) {
        this.links = [];
        this.min = min;
        this.max = max;
        this.normOutSignal = 0;
    }

    get signal(): number {
        return this.normOutSignal;
    }

    get outLinks(): NeuronLink[] {
        return this.links;
    }

    public addLink(link: NeuronLink) {
        this.links.push(link);
    }

    public addInputSignal(signal: number) {
        this.normalize(signal);
    }

    private normalize(value: number) {
        this.normOutSignal = (value - this.min) / (this.max - this.min);
    }
}
