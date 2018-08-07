import { Neuron } from '../interfaces/Neuron.interface';

export interface NeuronLink {
    weight: number;
    neuron: Neuron;
}