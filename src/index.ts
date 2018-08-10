import { NeuralNet } from './classes/NeuralNet';
import { trainingSet } from './consts/trainingSet.const';
import { sigma, threshold } from './functions/activatedFunctions';

const cnv: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('cnv');
const ctx = cnv.getContext('2d');
cnv.width = 10;
cnv.height = 10;

const emptyData: number[] = [];
for (let i = 0; i <= 99; i++) {
    emptyData.push(0);
}

const NN = new NeuralNet({
    activationFunc: sigma,
    hideLayers: 3,
    inputs: 100,
    layersSize: 15,
    outputs: 1,
    outActvationFunc: sigma
}, emptyData);
console.log(NN);
NN.start();

const imges = trainingSet.map(img => {
    const imgTag = new Image(10,10);
    imgTag.src = img.image;
    return imgTag;
});

setTimeout(() => {
    imges.forEach(img => {
        try {
            ctx.drawImage(img, 0, 0);
        } catch (e) {
            console.log(img);
        }
        const imgd = ctx.getImageData(0, 0, 10, 10);
        let pix = imgd.data;
        let toNetData: number [] = []
        for (let i = 0; i <= pix.length; i += 4) {
            if (pix[i] === 255 && pix[i + 1] === 255 && pix[i + 2] === 255) {
                toNetData.push(1);
            } else {
                toNetData.push(0);
            }
        }
        NN.newDataSet(toNetData);
    });
}, 60000);
