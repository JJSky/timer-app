import {
    Component,
    OnInit,
    Input,
    QueryList,
    ViewChildren,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable, from, combineLatest } from 'rxjs';
import { map, startWith, tap, switchMap, filter, pluck } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

import { CircuitState, SettingsState } from '@core/state';
import { StorageService, ModalService } from '@core/services';
import { CircuitDto, TimerDto, Settings } from '@shared/models';
import { CircuitTimerComponent } from '../circuit-timer/circuit-timer.component';

@Component({
    selector: 'app-circuit-view',
    templateUrl: './circuit-view.component.html',
    styleUrls: ['./circuit-view.component.scss'],
})
export class CircuitViewComponent implements OnInit {
    /**
     * Settings from state.
     */
    @Select(SettingsState.settings)
    public settings$: Observable<Settings>;

    /**
     * Circuit playing state.
     */
    @Select(CircuitState.isPlaying)
    public isPlaying$: Observable<boolean>;

    /**
     * Set circuit status isPlaying in state.
     */
    @Emitter(CircuitState.setPlaying)
    private _setPlaying: Emittable<boolean>;

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
    @ViewChildren('scrollTo') scrollList: QueryList<any>;

    @Output()
    public editCircuit: EventEmitter<CircuitDto> = new EventEmitter<CircuitDto>();
    @Output()
    public deleteCircuit: EventEmitter<any> = new EventEmitter<any>();

    public numTimers$: BehaviorSubject<number> = new BehaviorSubject(0);
    public playIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
    public circuitComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public percentComplete$: Observable<number> = combineLatest(
        this.numTimers$,
        this.playIndex$
    ).pipe(map(([totalNum, curIndex]) => curIndex / totalNum));

    public playFireWorks$: Observable<boolean> = combineLatest(
        this.circuitComplete$,
        this.settings$.pipe(map((s) => s.fireworks))
    ).pipe(map(([complete, fireworks]) => complete && fireworks));

    constructor(
        private readonly _storageService: StorageService,
        private readonly _modalService: ModalService
    ) {}

    ngOnInit(): void {}

    /** Play or pause timers based on status. */
    public play(): void {
        const curPlayIndex = this.playIndex$.value;
        const numTimers = this.numTimers$.value;

        // Check if circuit is complete
        if (curPlayIndex >= numTimers) {
            console.log('complete circuit', curPlayIndex, numTimers);
            this.circuitComplete$.next(true);
            // play confetti here
        } else {
            // Tell matching playIndex timer to play
            const timerArray = this.timers.toArray();
            timerArray[curPlayIndex].play();

            // Scroll to active timer
            const els = this.scrollList.toArray();
            els[curPlayIndex].el.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            });
        }
    }

    public pauseTimer(): void {
        const curPlayIndex = this.playIndex$.value;
        const timerArray = this.timers.toArray();

        // Don't try to pause if circuit is complete
        if (!this.circuitComplete$.value) {
            timerArray[curPlayIndex].pause();
        }
    }

    /** Skip to next timer in circuit. */
    public skip(): void {
        console.log('skip current timer');
        const curTimers = this.timers.toArray();
        this._setPlaying.emit(false);

        // Don't skip if circuit is already complete
        if (!this.circuitComplete$.value) {
            curTimers[this.playIndex$.value].stop();
            this.nextTimer();
        }
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
    public async delete(): Promise<void> {
        from(this._modalService.confirmCircuitDeleteModal(this.circuit$.value))
            .pipe(
                switchMap((alert) => alert.onDidDismiss()),
                filter((res) => !!res.data && typeof res.data === 'string'),
                tap((_) => this.deleteCircuit.emit()),
                switchMap((res) => {
                    this.deleteCircuit.emit();
                    return this._storageService.deleteCircuit(res.data);
                })
            )
            .subscribe();

        // const alert = await this._modalService.confirmCircuitDeleteModal(this.circuit$.value);
        // const res = await alert.onDidDismiss();
        // if (!!res.data && typeof res.data === 'string') {
        //     this._storageService.deleteCircuit(this.circuit$.value.id);
        //     this.deleteCircuit.emit();
        // }
    }

    /**
     * Increment playIndex.
     */
    public nextTimer(): void {
        const nextIndex = this.playIndex$.value + 1;
        this.playIndex$.next(nextIndex);

        this.play();
    }

    public timerTrackBy(index: number, item: TimerDto): string {
        if (!item) {
            return null;
        }
        return item.id;
    }
}
