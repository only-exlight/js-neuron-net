import { NeuronLink } from './NeuronLink.interface';

export interface Neuron {
    addLink(link: NeuronLink): void;
    addInputSignal(val: number): void;
    changeInputSignal(val: number, i: number): void;
}

export interface NeuronV2 {
    nextLayer: NeuronV2[];
    backLayer: NeuronV2[];
    putSignal(val: number): void;
    setBackLayerNeuron(val: NeuronV2): void;
}
