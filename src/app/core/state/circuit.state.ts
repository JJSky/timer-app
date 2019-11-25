import { State, StateContext, Selector } from '@ngxs/store';
import { CircuitDto } from 'src/app/shared/models';
import { ImmutableContext, ImmutableSelector } from '@ngxs-labs/immer-adapter';
import { Receiver } from '@ngxs-labs/emitter';

export interface CircuitStateModel {
    circuits: CircuitDto[];
}

@State<CircuitStateModel>({
    name: 'circuit',
    defaults: {
        circuits: []
    }
})
export class CircuitState {
    constructor() {}

    @Selector()
    @ImmutableSelector()
    public static circuits(state: CircuitStateModel): CircuitDto[] {
        return state.circuits;
    }

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

    @Receiver()
    @ImmutableContext()
    public static deleteCircuit(
        { setState }: StateContext<CircuitStateModel>,
        { payload }: { payload: CircuitDto }
    ): void {
        setState((state: CircuitStateModel) => {
            const index = state.circuits.indexOf(payload);
            state.circuits.splice(index);
            return state;
        });
    }

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
