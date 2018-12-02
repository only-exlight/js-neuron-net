import { AbstractNeuron } from './AbstractNeuron';
import { sigma } from '../../functions/activatedFunctions';

export class Hideneuron extends AbstractNeuron {

    constructor() {
        super();
    }

    public activation(val: number): number {
        return sigma(val);
    }
}