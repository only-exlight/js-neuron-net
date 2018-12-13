abstract class NeuronNet {
    public E: number
    public A: number;
    public backpropagation(waitVal: number) {
        // console.warn(`Обратное распространение, ожидалось: ${waitVal}, сейчас ${this.outLayer[0].signal}`);
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

    public calcMSE(elements: number[], wait: number): number {
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
}