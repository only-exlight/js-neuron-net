export interface NeuralNetConfig {
    inputs: number;
    outputs: number;
    hideLayers: number;
    layersSize: number;
    activationFunc: Function;
    outActvationFunc: Function;
}
