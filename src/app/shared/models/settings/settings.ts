export class Settings {
    darkMode: boolean = false;
    fireworks: boolean = true;
    fullscreenCircuits: boolean = false;
    volume: number = 1;

    constructor(params?: Partial<Settings>) {
        if (!!params) {
            this.darkMode = typeof params.darkMode !== undefined ? params.darkMode : this.darkMode;
            this.fireworks =
                typeof params.fireworks !== undefined ? params.fireworks : this.fireworks;
            this.fullscreenCircuits =
                typeof params.fullscreenCircuits !== undefined
                    ? params.fullscreenCircuits
                    : this.fullscreenCircuits;
            this.volume =
                typeof params.fullscreenCircuits !== undefined ? params.volume : this.volume;
        }
    }
}
