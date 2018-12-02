import { Hideneuron } from '../Neurons/HideNeuron';

export class Layer {
    private neurons: Map<number,Hideneuron> = new Map();
    constructor(private size: number) {
        this.initNeurons();
    }

    get layerSize(): number {
        return this.size;
    }

    private initNeurons() {
        for (let i = 0; i < this.size; i++) {
            this.neurons.set(i, new Hideneuron());
        }
    }
}