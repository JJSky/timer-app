import {
    Component,
    OnInit,
    Input,
    QueryList,
    ViewChildren,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CircuitDto, TimerDto } from '@shared/models';
import { StorageService, ModalService } from '@core/services';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import {
    BehaviorSubject,
    Observable,
    merge,
    Subject,
    from,
    forkJoin,
} from 'rxjs';
import {
    take,
    map,
    startWith,
    tap,
    switchMap,
    filter,
    distinctUntilChanged,
} from 'rxjs/operators';
import { CircuitTimerComponent } from '../circuit-timer/circuit-timer.component';
import { Select } from '@ngxs/store';
import { CircuitState } from '@core/state';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

@Component({
    selector: 'app-circuit-view',
    templateUrl: './circuit-view.component.html',
    styleUrls: ['./circuit-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircuitViewComponent implements OnInit {
    /**
     * Circuit playing state.
     */
    @Select(CircuitState.isPlaying)
    public isPlaying$: Observable<boolean>;

    /**
     * Circuit data from home page.
     */
    public circuit$: BehaviorSubject<CircuitDto> = new BehaviorSubject(null);
    @Input('circuit')
    public set setCircuit(value: CircuitDto) {
        this.circuit$.next(value);
    }

    /**
     * Timer data from circuit.
     */
    public readonly timers$: Observable<TimerDto[]> = this.circuit$.pipe(
        map((circuit) => circuit.timers),
        tap((timers) => {
            // this.resetTimers();
            this.numTimers$.next(timers.length);
        }),
        startWith([])
    );

    /**
     * Access to the countdown timer elements on the page.
     */
    @ViewChildren('childTimer') timers: QueryList<CircuitTimerComponent>;

    @Output()
    public editCircuit: EventEmitter<CircuitDto> = new EventEmitter<
        CircuitDto
    >();
    @Output()
    public deleteCircuit: EventEmitter<any> = new EventEmitter<any>();

    public numTimers$: BehaviorSubject<number> = new BehaviorSubject(0);
    public playIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
    public circuitComplete$: BehaviorSubject<boolean> = new BehaviorSubject(
        false
    );

    constructor(
        private readonly _storageService: StorageService,
        private readonly _modalService: ModalService
    ) {}

    ngOnInit(): void {}

    /** Play or pause timers based on status. */
    public play(): void {
        const curPlayIndex = this.playIndex$.value;
        const numTimers = this.numTimers$.value;
        console.log('try to play timer', curPlayIndex);

        // Check if circuit is complete
        if (curPlayIndex >= numTimers) {
            console.log('complete circuit', curPlayIndex, numTimers);
            this.circuitComplete$.next(true);
        } else {
            // Tell matching playIndex timer to play
            const timerArray = this.timers.toArray();
            timerArray[curPlayIndex].play();
        }
    }

    /** Skip to next timer in circuit. */
    public skip(): void {
        console.log('skip current timer');
        const curTimers = this.timers.toArray();
        curTimers[this.playIndex$.value].stop();
        this.nextTimer();
    }

    /** Reset timers to initial state. */
    public resetTimers(): void {
        // Make sure timer elements exist before trying to reset them
        if (!this.timers) {
            return;
        }

        console.log('reset timers');
        this.timers.forEach((t) => {
            t.reset();
        });
        this.playIndex$.next(0);
        this.circuitComplete$.next(false);
    }

    /** Delete circuit. */
    public delete(): void {
        from(this._modalService.confirmCircuitDeleteModal(this.circuit$.value))
            .pipe(
                switchMap((alert) => alert.onDidDismiss()),
                filter((res) => res.data && res.data === true),
                tap((_) => this.deleteCircuit.emit()),
                switchMap((res) => this._storageService.deleteCircuit(res.data))
            )
            .subscribe();

        // const alert = await this._modalService.confirmCircuitDeleteModal(this.circuit$.value);
        // const res = await alert.onDidDismiss();
        // if (!!res.data && res.data === true) {
        //     console.log('delete circuit', res.data);
        //     this._storageService.deleteCircuit(this.circuit$.value);
        //     this.deleteCircuit.emit();
        // }
    }

    /**
     * Increment playIndex.
     */
    public nextTimer(): void {
        const nextIndex = this.playIndex$.value + 1;
        this.playIndex$.next(nextIndex);

        // TODO: For some reason this play is activating on the stopped timer and not the next one
        this.play();
    }

    public timerTrackBy(index: number, item: TimerDto): string {
        if (!item) {
            return null;
        }
        return item.id;
    }
}
