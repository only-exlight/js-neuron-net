import { InputNeuron } from '../Neurons/InputNeuron';

export class InputLayer {
    private neurons: Map<number,InputNeuron> = new Map();

    constructor (private countInput: number) {
        this.initNeurons(countInput);
    }

    get layerSize(): number {
        return this.countInput;
    }

    public initNeurons(countInput: number) {
        for (let i = 0; i < countInput; i++) {
            this.neurons.set(i, new InputNeuron());
        }
    }

    public putData(val: Int8Array) {
        for (let i = 0; i < val.length; i++) {
            this.neurons.get(i).putSignal(val[i]);
        }
    }
}