import { OutNeuron } from '../Neurons/OutNeuron';
export class OutLayer {
    private neurons: Map<number, OutNeuron> = new Map();
    constructor (private size: number) {
        this.initNeurons();
    }
    private initNeurons() {
        for (let i = 0; i < this.size; i++) {
            this.neurons.set(i, new OutNeuron());
        }
    }

}