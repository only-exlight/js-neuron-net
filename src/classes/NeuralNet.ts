import { InputNeuron } from './InputNeuron';
import { OutputNeuron } from './OutputNeuron';
import { HideNeuron } from './Neuron';
import { NeuralNetConfig } from '../interfaces/NeuralNetConfig.interface';
import { Neuron } from '../interfaces/Neuron.interface';
import { sigma } from '../functions/activatedFunctions';

export class NeuralNet {
    private inputLayer: InputNeuron[] = [];
    private hideLeyers: Array<HideNeuron[]> = [];
    private outLayer: OutputNeuron[] = [];
    // E - скорость обучения, A - момент
    private E = 0.8;
    private A = 0.6;
    
    constructor (config: NeuralNetConfig, private inputValues: Int8Array) {
        this.initInputLayer(config.inputs, 0, 1, inputValues);
        this.initOutputLayer(config.outputs, config.outActvationFunc);
        this.initHideLayer(config.hideLayers, config.layersSize, config.activationFunc);
        this.initLinks(this.inputLayer, this.hideLeyers[0]);
        this.hideLeyers.forEach((layer, i) => {
            if (i < this.hideLeyers.length - 1) {
                this.initLinks(layer, this.hideLeyers[i + 1]);
            }
        });
        this.initLinks(this.hideLeyers[this.hideLeyers.length - 1], this.outLayer);
    }

    public correctWegth(waitVal: number): void {
        const outWeightsDelta: number[] = [];

        this.outLayer.forEach(outNeuron => {
            const err = outNeuron.signal - waitVal;
            outWeightsDelta.push(err * (sigma(outNeuron.signal) * (1 - sigma(outNeuron.signal))));
        });
        console.log(outWeightsDelta);
        for (let i = this.hideLeyers.length - 1; i <= 0; i--) {
            this.hideLeyers[i].forEach(hideNeuron => {
                hideNeuron.outLinks.forEach(link => {
                    link.weight = link.weight - hideNeuron.signal * outWeightsDelta[0] * 0.1 //learn reate;
                })
            })
        }
    }
    //
    public loadFromJSON(json: string) {
        const netObj = JSON.parse(json);
        console.log(netObj);
        this.A = netObj.A;
        this.E = netObj.E;
        for (let i = 0; i < this.inputLayer.length; i++) {
            const neuron = this.inputLayer[i];
            const jsonNData = netObj.inputLayer[i];
            neuron.initFromData(jsonNData);
        }

        for (let i = 0; i < this.hideLeyers.length; i++) {
            const layer = this.hideLeyers[i];
            const jsonLayer = netObj.hideLeyers[i];
            for (let j = 0; j < layer.length; j++) {
                const neuron = layer[j];
                const jsonNeuron = jsonLayer[j];
                neuron.initFromData(jsonNeuron);
            }
        }

        for (let i = 0; i < this.outLayer.length; i++) {
            const outNeuron = this.outLayer[i];
            const jsonOutNeuron = netObj.outLayer[i];
            outNeuron.initFromData(jsonOutNeuron);
        }
        console.log(this);
    }
    
    public backpropagation(waitVal: number) {
        
    }

    public start(): any {
        this.inputLayer.forEach(neuron => {
            neuron.outLinks.forEach(link => {
                const sumVal = neuron.signal * link.weight;
                link.neuron.addInputSignal(sumVal);
            });
        });
        this.hideLeyers.forEach(layer =>
            layer.forEach(neuron => {
                neuron.outLinks.forEach(link => {
                    const sumVal = neuron.signal * link.weight;
                    link.neuron.addInputSignal(sumVal);
                });
            })
        );
        this.outLayer.forEach(neuron => console.log(neuron.signal));
    }

    public newDataSet(data: Int8Array) {
        for (let i = 0; i < this.inputLayer.length; i++) {
            const inputNeuron = this.inputLayer[i];
            inputNeuron.addInputSignal(data[i]);
        }
        return this.restart();
    }

    private restart() {
        this.inputLayer.forEach((neuron, i) => {
            neuron.outLinks.forEach(link => {
                const sumVal = neuron.signal * link.weight;
                link.neuron.changeInputSignal(sumVal, i);
            });
        });
        this.hideLeyers.forEach(layer =>
            layer.forEach((neuron, i) => {
                neuron.outLinks.forEach(link => {
                    const sumVal = neuron.signal * link.weight;
                    link.neuron.changeInputSignal(sumVal,i);
                });
            })
        );
        return this.outLayer.map(neuron => neuron.signal);
    }

    private initInputLayer(inCount: number, min: number, max: number, inputValues: Int8Array): void {
        for (let i = 0; i < inCount; i++) {
            const inpNeuron = new InputNeuron(min, max);
            inpNeuron.addInputSignal(inputValues[i]);
            this.inputLayer.push(inpNeuron);
        }
    }
    
    private initHideLayer(hideCount: number, layersSize: number, actFunc: Function): void {
        for (let i = 0; i < hideCount; i++) {
            this.hideLeyers.push([]);
            for (let j = 0; j < layersSize; j++) {
                this.hideLeyers[i].push(new HideNeuron(3, actFunc));
            }
        }
    }

    private initOutputLayer(outCount: number, actFunc: Function): void {
        for (let i = 0; i < outCount; i++) {
            this.outLayer.push(new OutputNeuron(actFunc));
        }
    }

    private initLinks(firstLayer: any[], secondLayer: any[]): void {
        firstLayer.forEach((neuron: Neuron) => 
            secondLayer.forEach((lNeuron: Neuron) => 
                neuron.addLink({
                    weight: Math.random() * (1 - 0.1) + 0.1,
                    neuron: lNeuron,
                    lastChnge: 0
                })
        ));
    }    
}
