import { State, StateContext, Selector } from '@ngxs/store';
import { TimerDto } from '@shared/models';
import { ImmutableContext, ImmutableSelector } from '@ngxs-labs/immer-adapter';
import { Receiver } from '@ngxs-labs/emitter';

export interface TimerStateModel {
    timers: TimerDto[];
}

/** THIS IS NOT BEING USED AT ALL */
@State<TimerStateModel>({
    name: 'timer',
    defaults: {
        timers: [],
    },
})
export class TimerState {
    constructor() {}

    @Selector()
    @ImmutableSelector()
    public static timers(state: TimerStateModel): TimerDto[] {
        return state.timers;
    }

    @Receiver()
    @ImmutableContext()
    public static addTimer(
        { setState }: StateContext<TimerStateModel>,
        { payload }: { payload: TimerDto }
    ): void {
        setState((state: TimerStateModel) => {
            state.timers.push(payload);
            return state;
        });
    }

    @Receiver()
    @ImmutableContext()
    public static deleteTimer(
        { setState }: StateContext<TimerStateModel>,
        { payload }: { payload: TimerDto }
    ): void {
        setState((state: TimerStateModel) => {
            const index = state.timers.indexOf(payload);
            state.timers.splice(index);
            return state;
        });
    }

    @Receiver()
    @ImmutableContext()
    public static restoreTimers(
        { setState }: StateContext<TimerStateModel>,
        { payload }: { payload: TimerDto[] }
    ): void {
        setState((state: TimerStateModel) => {
            state.timers = payload;
            return state;
        });
    }
}
