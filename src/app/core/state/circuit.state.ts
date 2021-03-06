import { State, StateContext, Selector } from '@ngxs/store';
import { ImmutableContext, ImmutableSelector } from '@ngxs-labs/immer-adapter';
import { Receiver } from '@ngxs-labs/emitter';
import { CircuitDto } from '@shared/models';

export interface CircuitStateModel {
    circuits: CircuitDto[];
    isPlaying: boolean;
}

@State<CircuitStateModel>({
    name: 'circuit',
    defaults: {
        circuits: [],
        isPlaying: false,
    },
})
export class CircuitState {
    constructor() {}

    /**
     * Returns all circuits from the circuit state.
     */
    @Selector()
    @ImmutableSelector()
    public static circuits(state: CircuitStateModel): CircuitDto[] {
        return state.circuits;
    }

    /**
     * Returns whether a timer is currently playing.
     */
    @Selector()
    @ImmutableSelector()
    public static isPlaying(state: CircuitStateModel): boolean {
        return state.isPlaying;
    }

    /**
     * Set whether circuit is playing or not.
     */
    @Receiver()
    @ImmutableContext()
    public static setPlaying(
        { setState }: StateContext<CircuitStateModel>,
        { payload }: { payload: boolean }
    ): void {
        setState((state: CircuitStateModel) => {
            state.isPlaying = payload;
            return state;
        });
    }

    /**
     * Add a new circuit to the circuit state.
     */
    @Receiver()
    @ImmutableContext()
    public static addCircuit(
        { setState }: StateContext<CircuitStateModel>,
        { payload }: { payload: CircuitDto }
    ): void {
        setState((state: CircuitStateModel) => {
            state.circuits.push(payload);
            return state;
        });
    }

    /**
     * Update existing circuit in state.
     */
    @Receiver()
    @ImmutableContext()
    public static updateCircuit(
        { setState }: StateContext<CircuitStateModel>,
        { payload }: { payload: CircuitDto }
    ): void {
        setState((state: CircuitStateModel) => {
            const index = state.circuits.findIndex((c) => c.id === payload.id);
            state.circuits[index] = payload;
            return state;
        });
    }

    /**
     * Delete circuit from the circuit state.
     */
    @Receiver()
    @ImmutableContext()
    public static deleteCircuit(
        { setState }: StateContext<CircuitStateModel>,
        { payload }: { payload: string }
    ): void {
        setState((state: CircuitStateModel) => {
            const index = state.circuits.findIndex((c) => c.id === payload);
            state.circuits.splice(index, 1);
            return state;
        });
    }

    /**
     * Overwrite all circuits in circuit state.
     */
    @Receiver()
    @ImmutableContext()
    public static restoreCircuits(
        { setState }: StateContext<CircuitStateModel>,
        { payload }: { payload: CircuitDto[] }
    ): void {
        setState((state: CircuitStateModel) => {
            state.circuits = payload;
            return state;
        });
    }
}
