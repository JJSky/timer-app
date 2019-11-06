import { Component, OnInit } from '@angular/core';
import { ModalService, StorageService } from 'src/app/core/services';

@Component({
    selector: 'app-timer-home',
    templateUrl: './timer-home.component.html',
    styleUrls: ['./timer-home.component.scss']
})
export class TimerHomeComponent implements OnInit {
    public slideOpts: any = {
        initialSlide: 0,
        speed: 400
    };

    constructor(
        private _modalService: ModalService,
        private _storage: StorageService
    ) {}

    async ngOnInit(): Promise<void> {
        console.log(await this._storage.getCountdownTimer());
    }

    public async createTimer(): Promise<void> {
        const modal = await this._modalService.createTimer();
        const res = await modal.onDidDismiss();
        if (!!res.data) {
            await this._storage.saveCountdownTimer(res.data);
            console.log(res.data);
        }
    }
}
