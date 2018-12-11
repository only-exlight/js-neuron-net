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
    private E = 0.1;
    private A = 0.1;
    
    constructor (config: NeuralNetConfig, inputValues: Int8Array) {
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
    
    public backpropagation(waitVal: number) {
        console.warn(`Обратное распространение, ожидалось: ${waitVal}, сейчас ${this.outLayer[0].signal}`);
        const deltaOut = this.calcDeltaErrOut(waitVal, this.outLayer[0].signal);
        console.warn(`Итерация завершена!`);
    }

    private calcDeltaErrOut(ideal: number, current: number): number {
        const res = (ideal - current) * this.derivativeSigma(current);
        console.warn(`Дельта для выходного нейрона ${res}`);
        return res;
    }

    private calcDeltaErrHide(weight: number[], err: number, current: number) {
        let summ: number;
        for (let i = 0; i < weight.length; i++) {
            summ = weight[i] * err;
        }
        const res = this.derivativeSigma(current) * summ;
        console.warn(`Дельта ошибки для скрытого нейрона ${res}`);
        return res
    }

    private calcMSE(elements: number[], wait: number): number {
        let summ: number;
        for (let i = 0; i < elements.length; i++) {
            summ += Math.pow((wait - elements[i]), 2);
        }
        const res = summ / elements.length;
        console.warn(`Счиатем MSE ${res}`);
        return res;
    }

    private derivativeSigma(out: number): number {
        const res = (1 - out) * out
        console.warn(`Производная от sigma ${res}`);
        return res;
    }

    private GRAD(err: number, out: number) : number {
        const res = err * out;
        console.warn(`Градиент ${res}`);
        return res;
    }
    // E - скорость обучения, A - момент
    private calcChange(GRAD: number, lCh: number): number {
        const res = this.E * GRAD + this.A * lCh;
        console.warn(`Изменение веса ${res}`)
        return res;
    }
    //

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
            this.inputLayer[i].addInputSignal(data[i]);
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
                    neuron: lNeuron
                })
        ));
    }    
}
