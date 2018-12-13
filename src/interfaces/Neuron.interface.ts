import { NeuronLink } from './NeuronLink.interface';

export interface Neuron {
    signal: number;
    delta: number;
    err: number;
    outLinks: NeuronLink[];
    addLink(link: NeuronLink): void;
    addInputSignal(val: number): void;
    changeInputSignal(val: number, i: number): void;
}
