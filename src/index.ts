import { TRAINING_DATA } from './consts/learn-set';
import { sigma } from './functions/activatedFunctions';
import { TrainerApp } from './classes/TrainerApp';
import { CanvasParams } from './interfaces/CanvasParams';
import { NeuralNetConfig } from './interfaces/NeuralNetConfig.interface';

const cnvParams: CanvasParams = {
    id: 'cnv',
    height: 5,
    width: 5
};

const netParapms: NeuralNetConfig = {
    activationFunc: sigma,
    hideLayers: 2,
    inputs: 25,
    layersSize: 5,
    outputs: 1,
    outActvationFunc: sigma
};

const trainer = new TrainerApp(TRAINING_DATA, cnvParams, netParapms);
// trainer.loadNet();
trainer.initSet(TRAINING_DATA);

