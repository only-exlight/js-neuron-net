import { AbstractNeuron } from './AbstractNeuron';
import { threshold } from '../../functions/activatedFunctions';

export class OutNeuron extends AbstractNeuron {

    constructor() {
        super();
    }

    public activation(val: number): number {
        return threshold(val);
    }
}