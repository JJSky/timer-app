import { Injectable } from '@angular/core';
import { Plugins, PluginRegistry } from '@capacitor/core';
import { CountdownTimer } from 'ngx-countdown';
import { TimerState } from '../state';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { TimerDto } from 'src/app/shared/models';

const { Storage }: PluginRegistry = Plugins;

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    // Emit to this variable to add a timer to state
    @Emitter(TimerState.addTimer)
    private _addTimer: Emittable<TimerDto>;

    // Emit to this to overwrite all timers in state
    @Emitter(TimerState.restoreTimers)
    private _restoreTimers: Emittable<TimerDto[]>;

    // Emit to this to delete a timer in state
    @Emitter(TimerState.deleteTimer)
    private _deleteTimer: Emittable<TimerDto>;

    private _timerKey: string = 'timerKey';

    constructor() {}

    public async saveTimer(timer: any): Promise<void> {
        console.log('saving countdown timer to local storage', timer);
        const existingTimers = await this._getItem(this._timerKey);
        if (existingTimers !== null && existingTimers.length > 0) {
            console.log('timers already exist, append timer to local storage');
            existingTimers.push(timer);
            await this._storeItem(this._timerKey, existingTimers);
        } else {
            console.log('no timers, overwrite local storage');
            await this._storeItem(this._timerKey, [timer]);
        }

        console.log('save countdown timer to state');
        this._addTimer.emit(timer);
    }
    public async deleteTimer(timer: TimerDto): Promise<void> {
        const existingTimers = await this._getItem(this._timerKey);
        const index = existingTimers.indexOf(timer);
        if (index) {
            // Remove timer from local storage
            console.log('delete timer', timer.name);
            existingTimers.splice(index);
            console.log('after deletion', existingTimers);
            this._storeItem(this._timerKey, existingTimers);

            // Remove timer from state
            this._deleteTimer.emit(timer);
        }
    }
    public async restoreTimers(): Promise<void> {
        const savedTimers = await this._getItem(this._timerKey);
        if (savedTimers !== null) {
            console.log('restore timers', savedTimers);
            this._restoreTimers.emit(await this._getItem(this._timerKey));
        }
    }

    private async _storeItem(storageKey: string, value: any): Promise<void> {
        const valueAsString = JSON.stringify(value);
        await Storage.set({ key: storageKey, value: valueAsString });
    }
    private async _getItem(storageKey: string): Promise<any> {
        const item = await Storage.get({ key: storageKey });
        return JSON.parse(item.value);
    }
}
