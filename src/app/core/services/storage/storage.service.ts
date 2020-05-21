import { Injectable } from '@angular/core';
import { Plugins, PluginRegistry } from '@capacitor/core';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { CircuitState, SettingsState } from '../../state';
import { CircuitDto, Settings } from '@shared/models';

const { Storage }: PluginRegistry = Plugins;

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    // Emit to these to add/update/restore/delete circuits in state
    @Emitter(CircuitState.addCircuit)
    private _addCircuit: Emittable<CircuitDto>;

    @Emitter(CircuitState.updateCircuit)
    private _updateCircuit: Emittable<CircuitDto>;

    @Emitter(CircuitState.restoreCircuits)
    private _restoreCircuits: Emittable<CircuitDto[]>;

    @Emitter(CircuitState.deleteCircuit)
    private _deleteCircuit: Emittable<string>;

    // Emit to these to work with settings
    @Emitter(SettingsState.setSettings)
    private _setSettings: Emittable<Settings>;

    private _circuitKey: string = 'circuitKey';
    private _settingsKey: string = 'settingsKey';

    constructor() {}

    /**
     * Saves circuit to local storage and circuit state.
     * @param circuit Circuit to save to local storage & state.
     */
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

    /**
     * Update circuit in local storage and circuit state.
     * @param circuit Circuit to update in local storage & state.
     */
    public async updateCircuit(circuit: CircuitDto): Promise<void> {
        console.log('saving edited circuit to local storage', circuit);
        const existingCircuits = await this._getItem(this._circuitKey);
        const indexToUpdate = existingCircuits.findIndex(
            (c: CircuitDto) => c.id === circuit.id
        );
        existingCircuits[indexToUpdate] = circuit;
        await this._storeItem(this._circuitKey, existingCircuits);

        console.log('save edited circuit to state');
        this._updateCircuit.emit(circuit);
    }

    /**
     * Deletes a circuit from local storage and circuit state.
     * @param circuit Circuit to delete from local storage & state.
     */
    public async deleteCircuit(circuitId: string): Promise<void> {
        const existingCircuits = await this._getItem(this._circuitKey);
        const index = existingCircuits.findIndex(
            (c: CircuitDto) => c.id === circuitId
        );

        if (index !== -1) {
            // Remove circuit from local storage
            console.log('delete circuit', circuitId);
            existingCircuits.splice(index);
            await this._storeItem(this._circuitKey, existingCircuits);

            // Remove circuit from state
            this._deleteCircuit.emit(circuitId);
        }
    }

    /** Get circuits from local storage and overwrite circuit state. */
    public async restoreCircuits(): Promise<void> {
        const savedCircuits = await this._getItem(this._circuitKey);
        if (savedCircuits !== null && savedCircuits.length > 0) {
            console.log('restore circuits', savedCircuits);
            this._restoreCircuits.emit(await this._getItem(this._circuitKey));
        } else {
            console.log('no circuits to restore');
        }
    }

    /**
     * Update settings in local storage and settings state.
     * @param settings Settings to update in local storage & state.
     */
    public async updateSettings(settings: Settings): Promise<void> {
        console.log('saving updated settings to local storage', settings);
        await this._storeItem(this._settingsKey, settings);

        console.log('save updated settings to state');
        this._setSettings.emit(settings);
    }

    /** Get settings from local storage and overwrite settings state. */
    public async restoreSettings(): Promise<void> {
        const savedSettings = await this._getItem(this._settingsKey);
        console.log('settings: ', savedSettings);
        if (savedSettings !== null) {
            console.log('restore settings', savedSettings);

            document.body.classList.toggle('dark', savedSettings.darkMode);
            this._setSettings.emit(await this._getItem(this._settingsKey));
        } else {
            console.log('no saved settings');
        }
    }

    /**
     * JSON stringifies and stores key value pair in local storage.
     * @param storageKey Key to save value under.
     * @param value Value to save in local storage.
     */
    private async _storeItem(storageKey: string, value: any): Promise<void> {
        const valueAsString = JSON.stringify(value);
        await Storage.set({ key: storageKey, value: valueAsString });
    }

    /**
     * Gets value from local storage based on key.
     * @param storageKey Key to retreive data with.
     */
    private async _getItem(storageKey: string): Promise<any> {
        const item = await Storage.get({ key: storageKey });
        return JSON.parse(item.value);
    }
}
