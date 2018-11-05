import { InputNeuron } from './InputNeuron';
import { OutputNeuron } from './OutputNeuron';
import { HideNeuron } from './Neuron';
import { NeuralNetConfig } from '../interfaces/NeuralNetConfig.interface';
import { NeuronLink } from '../interfaces/NeuronLink.interface';
import { Neuron } from '../interfaces/Neuron.interface';
import { sigma } from '../functions/activatedFunctions';

export class NeuralNet {
    private inputLayer: InputNeuron[] = [];
    private hideLeyers: Array<HideNeuron[]> = [];
    private outLayer:  OutputNeuron[] = [];
    
    constructor(config: NeuralNetConfig, inputValues: number[]) {
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
        for (let i = this.hideLeyers.length - 1; i <= 0; i--) {
            this.hideLeyers[i].forEach(hideNeuron => {
                hideNeuron.outLinks.forEach(link => {
                    link.weight = link.weight - hideNeuron.signal * outWeightsDelta[0] * 0.1 //learn reate;
                })
            })
        }
        console.log(this);
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

    public newDataSet(data: number[]) {
        for (let i = 0; i < this.inputLayer.length; i++) {
            this.inputLayer[i].addInputSignal(data[i]);
        }
        this.restart();
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
        this.outLayer.forEach(neuron => console.log(neuron.signal));
    }

    private initInputLayer(inCount: number, min: number, max: number, inputValues: number[]): void {
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
                    neuron: lNeuron
                })
        ));
    }    
}
