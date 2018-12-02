import { Layer } from "./Layer";

export class HideLayer {
    private layers: Layer[] = [];
    constructor(private count: number, private size: number) {
        this.initLayers();
    }

    public initLayers() {
        for (let i = 0; i < this.count; i++) {
            this.layers.push(new Layer(this.size));
        }
    }
    
}