import { Component, OnInit } from '@angular/core';
import { ModalService, StorageService } from 'src/app/core/services';
import { Select } from '@ngxs/store';
import { TimerState } from 'src/app/core/state';
import { Observable } from 'rxjs';
import { TimerDto } from 'src/app/shared/models';

@Component({
    selector: 'app-timer-home',
    templateUrl: './timer-home.component.html',
    styleUrls: ['./timer-home.component.scss']
})
export class TimerHomeComponent implements OnInit {
    @Select(TimerState.timers)
    public timers$: Observable<TimerDto[]>;

    public slideOpts: any = {
        initialSlide: 0,
        speed: 400,
        renderBullet: (index, className): string => {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        }
    };

    constructor(
        private _modalService: ModalService,
        private _storage: StorageService
    ) {}

    async ngOnInit(): Promise<void> {
        // console.log(await this._storage.getCountdownTimer());
    }

    public async createTimer(): Promise<void> {
        const modal = await this._modalService.createTimer();
        const res = await modal.onDidDismiss();
        if (!!res.data) {
            console.log('create timer', res.data);
            await this._storage.saveTimer(res.data);
        }
    }
}
