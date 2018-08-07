import { InputNeuron } from './InputNeuron';
import { OutputNeuron } from './OutputNeuron';
import { HideNeuron } from './Neuron';
import { NeuralNetConfig } from '../interfaces/NeuralNetConfig.interface';
import { NeuronLink } from '../interfaces/NeuronLink.interface';
import { Neuron } from '../interfaces/Neuron.interface';

export class NeuralNet {
    private inputLayer: InputNeuron[] = [];
    private hideLeyers: Array<HideNeuron[]> = [];
    private outLayer:  OutputNeuron[] = [];
    
    constructor(config: NeuralNetConfig, inputValues: number[]) {
        this.initInputLayer(config.inputs, 0, 5, inputValues);
        this.initOutputLayer(config.outputs, config.outActvationFunc);
        this.initHideLayer(config.hideLayers, config.layersSize, config.activationFunc);
        this.initLinks(this.inputLayer, this.hideLeyers[1]);
        this.hideLeyers.forEach((layer, i) => {
            if (i < this.hideLeyers.length - 1) {
                this.initLinks(layer, this.hideLeyers[i + 1]);
            }
        });
        this.initLinks(this.hideLeyers[this.hideLeyers.length - 1], this.outLayer);
    }

    public correctWegth(): void {

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
                    weight: Math.random(),
                    neuron: lNeuron
                })
        ));
    }    
}
