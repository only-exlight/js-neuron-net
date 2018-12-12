import { NeuronLink } from '../interfaces/NeuronLink.interface';
import { Neuron } from '../interfaces/Neuron.interface';

export class InputNeuron implements Neuron {
    private links: NeuronLink[] = [];
    private min: number;
    private max: number;
    private normOutSignal = 0;

    public delta: number;

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

    public initFromData(neuron: any) {
        for (let i = 0; i < neuron.links.length; i++) {
            const jsonLink = neuron.links[i];
            this.links[i].weight = jsonLink.weight;
            this.links[i].lastChnge = jsonLink.lastChnge;
        }
    }

    public changeInputSignal(signal: number, i: number ): void {
        this.normalize(signal);
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
