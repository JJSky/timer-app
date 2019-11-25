import { Injectable } from '@angular/core';
import { Plugins, PluginRegistry } from '@capacitor/core';
import { CountdownTimer } from 'ngx-countdown';
import { TimerState, CircuitState } from '../state';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { TimerDto, CircuitDto } from 'src/app/shared/models';

const { Storage }: PluginRegistry = Plugins;

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    // Emit to these to add/restore/delete circuits in state
    @Emitter(CircuitState.addCircuit)
    private _addCircuit: Emittable<CircuitDto>;

    @Emitter(CircuitState.restoreCircuits)
    private _restoreCircuits: Emittable<CircuitDto[]>;

    @Emitter(CircuitState.deleteCircuit)
    private _deleteCircuit: Emittable<CircuitDto>;

    // Emit to these to add/restore/delete timers in state
    // @Emitter(TimerState.addTimer)
    // private _addTimer: Emittable<TimerDto>;

    // @Emitter(TimerState.restoreTimers)
    // private _restoreTimers: Emittable<TimerDto[]>;

    // @Emitter(TimerState.deleteTimer)
    // private _deleteTimer: Emittable<TimerDto>;

    // Storage keys
    // private _timerKey: string = 'timerKey';
    private _circuitKey: string = 'circuitKey';

    constructor() {}

    // ~~~~~~~~~~~~~~ CIRCUITS START HERE ~~~~~~~~~~~~~~
    public async saveCircuit(circuit: CircuitDto): Promise<void> {
        console.log('saving circuit to local storage', circuit);
        const existingCircuits = await this._getItem(this._circuitKey);
        if (existingCircuits !== null && existingCircuits.length > 0) {
            console.log(
                'circuits already exist, append circuit to local storage'
            );
            existingCircuits.push(circuit);
            await this._storeItem(this._circuitKey, existingCircuits);
        } else {
            console.log('no circuits, overwrite local storage');
            await this._storeItem(this._circuitKey, [circuit]);
        }
        console.log('save circuit to state');
        this._addCircuit.emit(circuit);
    }
    public async deleteCircuit(circuit: CircuitDto): Promise<void> {
        const existingCircuits = await this._getItem(this._circuitKey);
        const index = existingCircuits.indexOf(circuit);
        if (index) {
            // Remove circuit from local storage
            console.log('delete circuit', circuit.name);
            existingCircuits.splice(index);
            this._storeItem(this._circuitKey, existingCircuits);

            // Remove timer from state
            this._deleteCircuit.emit(circuit);
        }
    }
    public async restoreCircuits(): Promise<void> {
        const savedCircuits = await this._getItem(this._circuitKey);
        if (savedCircuits !== null && savedCircuits.length > 0) {
            console.log('restore circuits', savedCircuits);
            this._restoreCircuits.emit(await this._getItem(this._circuitKey));
        } else {
            console.log('no circuits to restore');
        }
    }

    // ~~~~~~~~~~~~~~ TIMERS START HERE ~~~~~~~~~~~~~~
    // public async saveTimer(timer: any): Promise<void> {
    //     // Generate and append unique id
    //     console.log('saving countdown timer to local storage', timer);
    //     const existingTimers = await this._getItem(this._timerKey);
    //     if (existingTimers !== null && existingTimers.length > 0) {
    //         console.log('timers already exist, append timer to local storage');
    //         existingTimers.push(timer);
    //         await this._storeItem(this._timerKey, existingTimers);
    //     } else {
    //         console.log('no timers, overwrite local storage');
    //         await this._storeItem(this._timerKey, [timer]);
    //     }

    //     console.log('save countdown timer to state');
    //     this._addTimer.emit(timer);
    // }
    // public async deleteTimer(timer: TimerDto): Promise<void> {
    //     const existingTimers = await this._getItem(this._timerKey);
    //     const index = existingTimers.indexOf(timer);
    //     if (index) {
    //         // Remove timer from local storage
    //         console.log('delete timer', timer.name);
    //         existingTimers.splice(index);
    //         console.log('after deletion', existingTimers);
    //         this._storeItem(this._timerKey, existingTimers);

    //         // Remove timer from state
    //         this._deleteTimer.emit(timer);
    //     }
    // }
    // public async restoreTimers(): Promise<void> {
    //     const savedTimers = await this._getItem(this._timerKey);
    //     if (savedTimers !== null && savedTimers.length > 0) {
    //         console.log('restore timers', savedTimers);
    //         this._restoreTimers.emit(await this._getItem(this._timerKey));
    //     } else {
    //         console.log('no timers to restore');
    //     }
    // }

    // Facilitate JSON stringifying and parsing
    private async _storeItem(storageKey: string, value: any): Promise<void> {
        const valueAsString = JSON.stringify(value);
        await Storage.set({ key: storageKey, value: valueAsString });
    }
    private async _getItem(storageKey: string): Promise<any> {
        const item = await Storage.get({ key: storageKey });
        return JSON.parse(item.value);
    }
}
