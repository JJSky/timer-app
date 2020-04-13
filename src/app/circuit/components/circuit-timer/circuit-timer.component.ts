import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { TimerDto } from '@shared/models';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';

@Component({
    selector: 'app-circuit-timer',
    templateUrl: './circuit-timer.component.html',
    styleUrls: ['./circuit-timer.component.scss'],
})
export class CircuitTimerComponent implements OnInit {
    /**
     * Timer element on the page.
     */
    @ViewChild('countdownTimer', { static: false }) timer: CountdownComponent;

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

    /** Emits if this timer completes. */
    @Output()
    public timerComplete: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Is this timer currently counting down.
     */
    public isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject(false);

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
        console.log('am I active?', this.isActive);
        // Do nothing if not an active timer
        if (!this.isActive) {
            return;
        }

        // Check if timer is currently counting down
        const isPlaying = this.isPlaying$.value;

        // Pause if it is counting down, play if not
        if (isPlaying) {
            this.timer.pause();
        } else {
            this.timer.resume();
        }

        // Update status of this timer
        this.isPlaying$.next(!isPlaying);
    }

    public stop(): void {
        this.timer.stop();
    }

    /**
     * Reset timer to initial state.
     */
    public reset(): void {
        this.isPlaying$.next(false);
        this.timer.restart();
    }

    /** Output and handle events output by timers. */
    public handleTimer(e: CountdownEvent): void {
        console.log('timer event: ', e);

        // Emit if timer completes
        if (e.action === 'done') {
            this.isPlaying$.next(false);
            this.timerComplete.emit();
        }
    }
}
