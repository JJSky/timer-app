import {
    Component,
    OnInit,
    Input,
    ViewChild,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { Emitter, Emittable } from '@ngxs-labs/emitter';

import { CircuitState } from '@core/state';
import { SoundService } from '@core/services';
import { TimerDto } from '@shared/models';

@Component({
    selector: 'app-circuit-timer',
    templateUrl: './circuit-timer.component.html',
    styleUrls: ['./circuit-timer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircuitTimerComponent implements OnInit {
    /**
     * Set circuit status isPlaying in state.
     */
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

    constructor(private readonly _soundService: SoundService) {}

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
            // If nextTimer has run and isPlaying isn't false yet
            // play this timer anyways (HACKY)
            if (this.timer.left === this.timerData.totalTime) {
                // console.log('pause timer, just kidding keep going');
                this.timer.resume();

                // Update circuit status
                this._setPlaying.emit(true);
            } else {
                console.log('pause timer');
                this.timer.pause();

                // Update circuit status
                this._setPlaying.emit(false);
            }
        } else {
            this.timer.resume();

            // Update circuit status
            this._setPlaying.emit(true);
        }
    }

    /**
     * Pause timer.
     */
    public pause(): void {
        this.timer.pause();
        this._setPlaying.emit(false);
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

    /**
     * Output and handle events output by timers.
     */
    public handleTimer(e: CountdownEvent): void {
        // console.log('timer event: ', e);

        // Emit if timer completes
        if (e.action === 'done') {
            this._setPlaying.emit(false);
            this.timerComplete.emit();
            this._soundService.playCompleteSound();
        }
    }
}
