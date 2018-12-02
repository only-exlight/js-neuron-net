import { NeuronV2 } from "../../interfaces/Neuron.interface";

export abstract class AbstractNeuron implements NeuronV2 {
    public signal: number[] = [];
    public theNextLayer: NeuronV2[] = [];
    private theBackLayer: NeuronV2[] = [];

    constructor() { }

    
    get nextLayer(): NeuronV2[] {
        return this.theNextLayer;
    }

    set nextLayer(layer: NeuronV2[]) {
        this.nextLayer.forEach(nextLayerNeuron => nextLayerNeuron.setBackLayerNeuron(this));
    }

    get backLayer(): NeuronV2[] {
        return this.theBackLayer;
    }

    public putNeuron(neuron: NeuronV2): void  {
        this.theBackLayer.push(neuron);
        this.nextLayer
    }

    public setBackLayerNeuron(neuron: NeuronV2): void {
        this.theBackLayer.push(neuron);
    }

    public putSignal(val: number): void {
        this.signal.push(val);
        if (this.signal.length === this.theBackLayer.length) {
            const summ = this.summOfSignals();
            const actVal = this.activation(summ);
            this.nextLayer.forEach(nextLayerNeurn => nextLayerNeurn.putSignal(actVal));
        }
    }

    public summOfSignals(): number {
        let summ = 0;
        for (let i = 0; i < this.signal.length; i++) {
            summ += this.signal[i];
        }
        return summ;
    }

    public abstract activation(summ: number ): number;

}