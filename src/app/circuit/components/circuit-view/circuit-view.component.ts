import { Component, OnInit, Input, QueryList, ViewChildren } from '@angular/core';
import { CircuitDto } from '@shared/models';
import { StorageService, ModalService } from '@core/services';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-circuit-view',
    templateUrl: './circuit-view.component.html',
    styleUrls: ['./circuit-view.component.scss']
})
export class CircuitViewComponent implements OnInit {
    @Input()
    public circuit: CircuitDto;

    public playIndex: number = 0;
    public isCountingDown$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public circuitComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    @ViewChildren('countdownTimer') timers: QueryList<CountdownComponent>;

    constructor(
        private readonly _storageService: StorageService,
        private readonly _modalService: ModalService
    ) {}

    ngOnInit(): void {}

    /** Output and handle events output by timers. */
    public handleTimer(e: CountdownEvent): void {
        console.log('timer event: ', e);
        if (e.action === 'done') {
            this.isCountingDown$.next(false);
            this.playIndex++;
            this.play();
        }
    }

    /** Play or pause timers based on status. */
    public play(): void {
        const curTimers = this.timers.toArray();

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
    public skip(): void {
        console.log('skip here');
    }
    public async deleteCircuit(): Promise<void> {
        const alert = await this._modalService.confirmCircuitDeleteModal(this.circuit);
        const res = await alert.onDidDismiss();
        if (!!res.data && res.data === true) {
            console.log('delete circuit', res.data);
            this._storageService.deleteCircuit(this.circuit);
        }
    }
}
