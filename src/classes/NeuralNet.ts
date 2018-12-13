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

    private MAGIC_NUMBER = 0.8;
    
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
        this.errOutLayer(waitVal);
        for (let i = this.hideLeyers.length - 1; i >= 0; i--) {
            const layer = this.hideLeyers[i];
            for (let j = 0; j < layer.length; j++) {
                const neuron = layer[j];
                // Если мы находимся на последнем слое
                if (i + 1 === this.hideLeyers.length) {
                    // console.log(`Last hide layer ${i}`);
                    this.errOfLayer(this.outLayer, neuron, waitVal);
                    // console.log('----------')
                } 
                // Если мы находимся c первого по предпоследний слой 
                else if (i >= 0 && i < this.hideLeyers.length - 1) {
                    // console.log(`Avarage hide layer ${i}`);
                    const nextHideLayer = this.hideLeyers[i + 1];
                    this.errOfLayer(nextHideLayer, neuron, waitVal);
                    // console.log('----------');
                }
            }
        }
        for (let i = 0; i < this.inputLayer.length; i++) {
            // console.log(`Input layer. Length: ${this.inputLayer.length}`);
            const inputNeuron = this.inputLayer[i];
            this.errOfLayer(this.hideLeyers[0], inputNeuron, waitVal);
            // console.log('----------');
        }
        
    }

    public errOutLayer(waitRes: number): void {
        const curOutSignal = this.outLayer[0].signal;
        this.outLayer[0].err = curOutSignal * (waitRes - curOutSignal) ** 2;
    }

    public errOfLayer(prevErrors: Neuron[], neuron: Neuron, waitRes: number): void {
        let summLxW: number = 0;
        for (let i = 0; i < prevErrors.length; i++) {
            const layerNeuron = prevErrors[i];
            const weight = neuron.outLinks[i].weight;
            summLxW += layerNeuron.err * weight;
        }
        // console.log(neuron.signal * (waitRes - neuron.signal) * summLxW);
        neuron.err = neuron.signal * (waitRes - neuron.signal) * summLxW;
        for (let i = 0; i < neuron.outLinks.length; i++) {
            const link = neuron.outLinks[i];
            const delta = this.MAGIC_NUMBER * link.neuron.err * neuron.signal;
            link.weight = link.weight - delta;
        }
       
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
        return this.outLayer.map(neuron => neuron);
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
