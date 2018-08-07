export function threshold(value: number, threshold: number): number {
    if (value > threshold) {
        return 1;
    } else {
        return 0;
    }
}

export function liner(value: number): number {
    return 1;
}

export function sigma(value: number): number {
    return 1 / 1 + Math.pow(Math.E, value);
}

export function tan(value: number): number {
    return Math.pow(Math.E, 2 * value) - 1 / Math.pow(Math.E, 2 * value) + 1;
} 