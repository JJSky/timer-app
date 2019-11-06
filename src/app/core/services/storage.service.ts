import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _timerKey: string = 'timerKey';

    constructor() {}

    public async saveCountdownTimer(timer: any): Promise<void> {
        // TO-DO: Get previous timers and append new timer to array, submit array
        // const savedTimers = await this._storage.get(this._timerKey);

        console.log('saving countdown timer to local storage', timer);
        await this._storeItem(this._timerKey, timer);
    }
    public async getCountdownTimer(): Promise<any> {
        const timer = await this._getItem(this._timerKey);
        // if (!!timer && typeof timer === "string" && timer !== "null") {
        if (!!timer && timer !== 'null') {
            return timer;
        } else {
            return '';
        }
    }

    private async _storeItem(storageKey: string, value: any): Promise<void> {
        const valueAsString = JSON.stringify(value);
        await Storage.set({ key: storageKey, value: valueAsString });
    }
    private async _getItem(storageKey: string): Promise<any> {
        const item = await Storage.get({ key: storageKey });
        console.log(item.value);
        console.log(JSON.parse(item.value));
        return '';
    }
}
