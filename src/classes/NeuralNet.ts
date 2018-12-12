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
    private E = 0.5;
    private A = 0.1;
    
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
        this.E = netObj.B;
        this.initInputLayer(netObj.inputLayer.length, 0, 1, this.inputValues);
    }
    
    public backpropagation(waitVal: number) {
        console.warn(`Обратное распространение, ожидалось: ${waitVal}, сейчас ${this.outLayer[0].signal}`);
        this.outLayer[0].delta = this.calcDELTAErrOut(waitVal, this.outLayer[0].signal);
        for (let i = this.hideLeyers.length - 1; i >= 0; i--) {
            const layer = this.hideLeyers[i];
            for (let j = 0; j < layer.length; j++) {
                const neuron = layer[j];
                let summ: number = 0;
                for (let k = 0; k < neuron.outLinks.length; k++) {
                    const link = neuron.outLinks[k];
                    summ += link.neuron.delta * link.weight;
                }
                neuron.delta = this.calcDeltaErrHide(this.derivativeSigma(neuron.signal), summ);
                for (let k = 0; k < neuron.outLinks.length; k++) {
                    const link = neuron.outLinks[k];
                    const linkGrad = this.GRAD(link.neuron.delta, neuron.signal);
                    link.lastChnge = this.calcChange(linkGrad, link.lastChnge);
                    // console.log(link.lastChnge);
                    link.weight += link.lastChnge;
                }
            }
        }
        for (let i = 0; i < this.inputLayer.length; i++) {
            const inputNeuron = this.inputLayer[i];
            let summ: number = 0;
                for (let k = 0; k < inputNeuron.outLinks.length; k++) {
                    const link = inputNeuron.outLinks[k];
                    summ += link.neuron.delta * link.weight;
                }
                inputNeuron.delta = this.calcDeltaErrHide(this.derivativeSigma(inputNeuron.signal), summ);
                for (let k = 0; k < inputNeuron.outLinks.length; k++) {
                    const link = inputNeuron.outLinks[k];
                    const linkGrad = this.GRAD(link.neuron.delta, inputNeuron.signal);
                    link.lastChnge = this.calcChange(linkGrad, link.lastChnge);
                    // console.log(link.lastChnge);
                    link.weight += link.lastChnge;
                }
            
        }
        // console.warn(`Итерация завершена!`);
    }

    private calcDELTAErrOut(ideal: number, current: number): number {
        const res = (ideal - current) * this.derivativeSigma(current);
        // console.warn(`Дельта для выходного нейрона ${res}`);
        return res;
    }

    private calcDeltaErrHide(sigma: number, summ: number) {
        const res = sigma * summ;
        // console.warn(`Дельта ошибки для скрытого нейрона ${res}`);
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
        // console.warn(`Производная от sigma ${res}`);
        return res;
    }

    private GRAD(err: number, out: number) : number {
        const res = err * out;
        // console.warn(`Градиент ${res}`);
        return res;
    }
    // E - скорость обучения, A - момент
    private calcChange(GRAD: number, lCh: number): number {
        const res = this.E * GRAD + this.A * lCh;
        // console.warn(`Изменение веса ${res}`)
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
                    neuron: lNeuron,
                    lastChnge: 0
                })
        ));
    }    
}
