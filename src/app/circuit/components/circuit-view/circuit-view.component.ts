import {
    Component,
    OnInit,
    Input,
    QueryList,
    ViewChildren,
    Output,
    EventEmitter
} from '@angular/core';
import { CircuitDto, TimerDto } from '@shared/models';
import { StorageService, ModalService } from '@core/services';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-circuit-view',
    templateUrl: './circuit-view.component.html',
    styleUrls: ['./circuit-view.component.scss']
})
export class CircuitViewComponent implements OnInit {
    public circuit$: BehaviorSubject<CircuitDto> = new BehaviorSubject(null);
    @Input('circuit')
    public set setCircuit(value: CircuitDto) {
        this.circuit$.next(value);
    }

    /** Timer data from circuit. */
    public readonly timers$: Observable<TimerDto[]> = this.circuit$.pipe(
        map(circuit => circuit.timers),
        startWith([])
    );

    /** Access to the countdown timer elements on the page. */
    @ViewChildren('countdownTimer') timers: QueryList<CountdownComponent>;

    @Output()
    public deletedCircuit: EventEmitter<any> = new EventEmitter<any>();

    public playIndex: number = 0;
    public isCountingDown$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public circuitComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private readonly _storageService: StorageService,
        private readonly _modalService: ModalService
    ) {}

    ngOnInit(): void {}

    /** Output and handle events output by timers. */
    public handleTimer(e: CountdownEvent): void {
        console.log('timer event: ', e);
        if (e.action === 'done') {
            // When timer completes, increase index and play next timer
            this.isCountingDown$.next(false);
            this.playIndex++;
            this.play();
        }
    }

    /** Play or pause timers based on status. */
    public play(): void {
        const curTimers = this.timers.toArray();

        // If circuit complete when user presses play button, reset timers
        if (this.circuitComplete$.value) {
            this.resetTimers();
            return;
        }

        // Check if circuit is complete
        if (this.playIndex >= curTimers.length) {
            console.log('complete circuit');
            this.circuitComplete$.next(true);
            return;
        }

        // If timer counting down, pause it. Otherwise, play
        if (this.isCountingDown$.value) {
            console.log('pause');
            curTimers[this.playIndex].pause();
            this.isCountingDown$.next(false);
        } else if (this.playIndex < curTimers.length) {
            console.log('play');
            curTimers[this.playIndex].resume();
            this.isCountingDown$.next(true);
        }
    }

    /** Skip to next timer in circuit. */
    public skip(): void {
        console.log('skip current timer');
        const curTimers = this.timers.toArray();
        curTimers[this.playIndex].stop();
        this.isCountingDown$.next(false);
        this.playIndex++;
        this.play();
    }

    /** Reset timers to initial state. */
    public resetTimers(): void {
        console.log('reset timers');
        const curTimers = this.timers.toArray();
        curTimers.forEach(timer => {
            timer.restart();
        });
        this.playIndex = 0;
        this.circuitComplete$.next(false);
    }

    /** Delete circuit. */
    public async deleteCircuit(): Promise<void> {
        const alert = await this._modalService.confirmCircuitDeleteModal(this.circuit$.value);
        const res = await alert.onDidDismiss();
        if (!!res.data && res.data === true) {
            console.log('delete circuit', res.data);
            this._storageService.deleteCircuit(this.circuit$.value);
            this.deletedCircuit.emit();
        }
    }
}
