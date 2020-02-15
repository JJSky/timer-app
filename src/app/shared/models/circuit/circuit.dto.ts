import { TimerDto } from '../timer/timer.dto';

export class CircuitDto {
    id: string = '';
    name: string = '';
    timers: TimerDto[] = [];

    constructor(params?: Partial<CircuitDto>) {
        // not a derived class (extends) so don't need super
        // super(params);
        if (!!params) {
            this.id = params.id || this.id;
            this.name = params.name || this.name;
            this.timers = params.timers || this.timers;
        }
    }
}
