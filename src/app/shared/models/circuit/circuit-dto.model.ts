import { TimerDto } from '../timer/timer-dto.model';

export class CircuitDto {
    id: string;
    name: string;
    timers: TimerDto[];
}
