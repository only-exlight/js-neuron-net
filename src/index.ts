import { TRAINING_DATA } from './consts/learn-set';
import { sigma, threshold } from './functions/activatedFunctions';
import { TrainerApp } from './classes/TrainerApp';
import { CanvasParams } from './interfaces/CanvasParams';
import { NeuralNetConfig } from './interfaces/NeuralNetConfig.interface';

const cnvParams: CanvasParams = {
    id: 'cnv',
    height: 10,
    width: 10
};

const netParapms: NeuralNetConfig = {
    activationFunc: sigma,
    hideLayers: 2,
    inputs: 100,
    layersSize: 5,
    outputs: 1,
    outActvationFunc: sigma
};

new TrainerApp(TRAINING_DATA, cnvParams, netParapms);
