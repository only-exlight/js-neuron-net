import { InputNeuron } from './InputNeuron';
import { OutputNeuron } from './OutputNeuron';
import { HideNeuron } from './Neuron';
import { NeuralNetConfig } from '../interfaces/NeuralNetConfig.interface';

export class NeuralNet {
    private inputLayer: InputNeuron[] = [];
    private hideLeyers: Array<HideNeuron[]> = [];
    private outLayer:  OutputNeuron[] = [];
    
    constructor(config: NeuralNetConfig) {
        this.initInputLayer(config.inputs);
        this.initOutputLayer(config.outputs);
        this.initHideLayer(config.hideLayers, config.layersSize, config.activationFunc);
    }
    
    private initInputLayer(inCount: number, min?: number, max?: number) {
        for (let i = 0; i < inCount; i++) {
            this.inputLayer.push(new InputNeuron(min, max))
        }
    }
    
    private initHideLayer(hideCount: number, layerCount: number, actFunc: Function) {
        for (let i = 0; i < layerCount; i++) {
            this.hideLeyers.push([]);
            for (let j = 0; j < hideCount; i++){
                this.hideLeyers[i].push(new HideNeuron(3, actFunc));
            }
        }
    }

    private initOutputLayer(outCount: number) {
        for (let i = 0; i < outCount; i++) {
            this.outLayer.push(new OutputNeuron());
        }
    }

    public randomCorrect() {
        
    }
}