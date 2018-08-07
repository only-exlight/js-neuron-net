import { NeuralNet } from './classes/NeuralNet';
import { sigma } from './functions/activatedFunctions';

const NN = new NeuralNet({
    activationFunc: sigma,
    hideLayers: 3,
    inputs: 3,
    layersSize: 5,
    outputs: 3
}, [1, 4, 2]);
console.log(NN);
NN.start();

/*
const num1: HTMLInputElement = <HTMLInputElement>document.getElementById('num1'),
    num2: HTMLInputElement = <HTMLInputElement>document.getElementById('num2'),
    result = document.getElementById('result'),
    many = document.getElementById('many'),
    few = document.getElementById('few'),
    ok = document.getElementById('ok'),
    calculate = document.getElementById('calculate');

calculate.addEventListener('click', () => {
    console.log()
});

many.addEventListener('click', () => { console.log('many') });
few.addEventListener('click', () => { console.log('few') });
ok.addEventListener('click', () => { console.log('ok') });
*/
