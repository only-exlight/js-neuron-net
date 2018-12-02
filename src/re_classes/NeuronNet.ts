import { InputLayer } from "./Layers/InputLayer";
import { HideLayer } from "./Layers/HideLayer";
import { OutLayer } from "./Layers/OutLayer";

export interface NetParams {
    countInput: number;
    countLayers: number;
    hideLayerSize: number;
    countOut: number;
}

export class NeuronNet {
    private inputLayer: InputLayer = new InputLayer(this.netParams.countInput);
    private outLayer: OutLayer = new OutLayer(this.netParams.countOut);
    private hideLayer: HideLayer = 
        new HideLayer(this.netParams.countLayers, this.netParams.hideLayerSize);

    constructor (private netParams: NetParams) { }

    public putData(val: Int8Array) {
      this.inputLayer.putData(val);
    }

    public loadNet() {

    }

    public saveNet() {

    }
}