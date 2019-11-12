import { Component, OnInit, Input } from '@angular/core';
import { TimerDto } from 'src/app/shared/models';
import { StorageService } from 'src/app/core/services';

@Component({
    selector: 'app-timer-countdown',
    templateUrl: './timer-countdown.component.html',
    styleUrls: ['./timer-countdown.component.scss']
})
export class TimerCountdownComponent implements OnInit {
    @Input()
    public timer: TimerDto;

    constructor(private _storageService: StorageService) {}

    ngOnInit(): void {}

    public deleteTimer(): void {
        this._storageService.deleteTimer(this.timer);
    }
}
