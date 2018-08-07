export class HideNeuron {
    private weights: number[] = [];
    private links: any[] = [];
    public activated: Function;
    constructor(inputCount: number, actFunc: Function) {
        this.weights = [];
        this.links = [];
        this.activated = actFunc;
        for (let i = 0; i < inputCount; i++) {
            this.weights.push(Math.random())
        }
        // console.log(this.weights)
    }

    private sumed(values: number[]) {
        let sum = 0;
        values.forEach((value, i) => sum += value * this.weights[i])
        return sum;
    }

    correctWeight(more = false) {
        if (more) {

        } else {

        }
    }
}