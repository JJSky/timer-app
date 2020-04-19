import {
    Component,
    OnInit,
    Input,
    ViewChild,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { TimerDto } from '@shared/models';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { take, tap, filter, takeUntil } from 'rxjs/operators';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { CircuitState } from '@core/state';
import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

@Component({
    selector: 'app-circuit-timer',
    templateUrl: './circuit-timer.component.html',
    styleUrls: ['./circuit-timer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircuitTimerComponent implements OnInit {
    @Emitter(CircuitState.setPlaying)
    private _setPlaying: Emittable<boolean>;

    /**
     * Timer element on the page.
     */
    @ViewChild('countdownTimer', { static: false })
    timer: CountdownComponent;

    /**
     * Timer data from parent.
     */
    @Input()
    public timerData: TimerDto;

    /**
     * This timer is active if it match the current playIndex
     * on the parent component.
     */
    @Input()
    public isActive: boolean = false;

    /**
     * Is circuit currently playing?
     */
    public isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    @Input('isPlaying')
    public set setIsPlaying(value: boolean) {
        this.isPlaying$.next(value);
    }

    /**
     * Emits if this timer completes.
     */
    @Output()
    public timerComplete: EventEmitter<any> = new EventEmitter<any>();

    private _unsub: Subject<void> = new Subject();

    constructor() {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._unsub.next();
        this._unsub.complete();
    }

    /**
     * Play timer if active.
     */
    public play(): void {
        // Do nothing if not an active timer
        // NOTE: this causes issues with consecutive timers
        // if (!this.isActive) {
        //     console.log('not an active timer, do not play');
        //     return;
        // }

        // Check if timer is currently counting down
        const playing = this.isPlaying$.value;

        // Pause if counting down, play if not
        if (playing) {
            console.log('pause timer');
            if (this.timer.left === this.timerData.totalTime) {
                this.timer.resume();
            } else {
                this.timer.pause();
            }
        } else {
            console.log('resume timer');
            this.timer.resume();
        }

        // Update circuit status
        this._setPlaying.emit(!playing);
    }

    /**
     * Stop timer (not resumable).
     */
    public stop(): void {
        console.log('stop timer');
        this.timer.stop();
    }

    /**
     * Reset timer to initial state.
     */
    public reset(): void {
        if (this.isActive) {
            this._setPlaying.emit(false);
        }
        this.timer.restart();
    }

    /** Output and handle events output by timers. */
    public handleTimer(e: CountdownEvent): void {
        console.log('timer event: ', e);

        // Emit if timer completes
        if (e.action === 'done') {
            console.log('done action');
            this._setPlaying.emit(false);
            this.timerComplete.emit();
        }
    }
}
