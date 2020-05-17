import { State, StateContext, Selector } from '@ngxs/store';
import { Settings } from '@shared/models';
import { ImmutableContext, ImmutableSelector } from '@ngxs-labs/immer-adapter';
import { Receiver } from '@ngxs-labs/emitter';

export interface SettingsStateModel {
    settings: Settings;
}

@State<SettingsStateModel>({
    name: 'settings',
    defaults: {
        settings: new Settings(),
    },
})
export class SettingsState {
    constructor() {}

    @Selector()
    @ImmutableSelector()
    public static settings(state: SettingsStateModel): Settings {
        return state.settings;
    }

    @Receiver()
    @ImmutableContext()
    public static setSettings(
        { setState }: StateContext<SettingsStateModel>,
        { payload }: { payload: Settings }
    ): void {
        setState((state: SettingsStateModel) => {
            state.settings = payload;
            return state;
        });
    }
}
