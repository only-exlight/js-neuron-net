import { NeuronLink } from './NeuronLink.interface';

export interface Neuron {
    addLink(link: NeuronLink): void;
    addInputSignal(val: number): void;
}
