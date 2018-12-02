import { AbstractNeuron } from './AbstractNeuron';
import { NeuronV2 } from '../../interfaces/Neuron.interface';

export class InputNeuron extends AbstractNeuron {
    private readonly min = 0;
    private readonly max = 1;

    constructor() {
        super();
    }

    set inpSignal(val: number) {
        const normSignal = this.normalize(val);
        this.putSignal(normSignal);
    }


    public putSignal(val: number) {
        this.signal.push(val);
        const summ = this.summOfSignals();
        const actVal = this.activation(summ);
        this.nextLayer.forEach(nextLayerNeurn => nextLayerNeurn.putSignal(actVal));
    }

    public activation(summ: number): number {
        return summ;
    }

    private normalize(val: number) {
        return (val - this.min) / (this.max - this.min);
    }
}