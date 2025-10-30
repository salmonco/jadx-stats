export interface Layer {
    name: string;
    href: string;
}

export interface Layers {
    layers: {
        layer: Layer[];
    };
}

export interface Sld {
    name: string;
    href: string;
}

export interface Slds {
    styles: {
        style: Sld[];
    };
}
