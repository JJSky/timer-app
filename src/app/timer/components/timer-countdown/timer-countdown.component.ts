import { Component, OnInit, Input } from '@angular/core';
import { CircuitDto } from 'src/app/shared/models';
import { StorageService } from 'src/app/core/services';

@Component({
    selector: 'app-timer-countdown',
    templateUrl: './timer-countdown.component.html',
    styleUrls: ['./timer-countdown.component.scss']
})
export class TimerCountdownComponent implements OnInit {
    @Input()
    public circuit: CircuitDto;

    constructor(private _storageService: StorageService) {}

    ngOnInit(): void {}

    public deleteCircuit(): void {
        this._storageService.deleteCircuit(this.circuit);
    }
}
