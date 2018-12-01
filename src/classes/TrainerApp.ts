import { TrainingExample } from '../interfaces/TrainingExample.interface';
import { CanvasParams } from '../interfaces/CanvasParams';
import { NeuralNet } from '../classes/NeuralNet';
import { NeuralNetConfig } from '../interfaces/NeuralNetConfig.interface';

export class TrainerApp {
    private ctx: CanvasRenderingContext2D;
    private images: HTMLImageElement[];
    private curNetData: Int8Array = new Int8Array(100);
    private net: NeuralNet;

    constructor (
        private trainerSet: TrainingExample[],
        cnvParams: CanvasParams,
        netParams: NeuralNetConfig
    ) {
        this.net = new NeuralNet(netParams, this.makeEmptyData());
        this.initCanvas(cnvParams);
        this.initSet(trainerSet);
    }

    private makeEmptyData(): Int8Array {
        const empty = new Int8Array(100);
        for (let i = 0; i < empty.length; i++) {
            empty[i] = 0;
        }
        return empty;
    }

    private initCanvas(cnvParams: CanvasParams): void {
        const cnv = <HTMLCanvasElement>document.getElementById(cnvParams.id);
        cnv.width = cnvParams.width;
        cnv.height = cnvParams.height;
        this.ctx = cnv.getContext('2d');
    }

    private initSet(trainerSet: TrainingExample[]): void {
        const promises: Promise<void>[] = [];
        this.images = trainerSet.map(trItem => {
            const imgElem = new Image(10, 10);
            imgElem.src = trItem.image;
            promises.push(this.initImgWait(imgElem));
            return imgElem;
        });
        Promise.all(promises).then(() => this.startTraining());
    }

    private initImgWait(imgElem: HTMLImageElement): Promise<void> {
        return new Promise((resolve: Function) => imgElem.addEventListener('load', () => resolve()));
    }

    private startTraining() {
        console.warn('Start training');
        this.images.forEach((img, i) => {
            this.getImageData(img);
            this.net.newDataSet(this.curNetData);
            if (this.trainerSet[i].isSquare) {
                this.net.correctWegth(1);
            } else {
                this.net.correctWegth(0);
            }
        })
    }

    private getImageData(img: HTMLImageElement) {
        try {
            this.ctx.drawImage(img, 0, 0);
        } catch (e) {
            console.log(e);
        }
        const imgData: ImageData = this.ctx.getImageData(0, 0, 10, 10);
        this.getPixelColor(imgData.data);
    }

    private getPixelColor(imageArray: Uint8ClampedArray) {
        // Where: i - R chanel, i + 1 - G changel, i + 2 - B changel, i + 3 A chanel
        for (let i = 0, k = 0; i <= imageArray.length; i += 4, k++) {
            if (imageArray[i] === 255 && imageArray[i + 1] === 255 && imageArray[i + 2] === 255) {
                this.curNetData[k] = 1;
            } else {
                this.curNetData[k] = 0;
            }
        }
    }
}