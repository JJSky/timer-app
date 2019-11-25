import { Component, OnInit } from '@angular/core';
import { ModalService, StorageService } from 'src/app/core/services';
import { Select } from '@ngxs/store';
import { CircuitState } from 'src/app/core/state';
import { Observable, BehaviorSubject } from 'rxjs';
import { CircuitDto } from 'src/app/shared/models';

@Component({
    selector: 'app-timer-home',
    templateUrl: './timer-home.component.html',
    styleUrls: ['./timer-home.component.scss']
})
export class TimerHomeComponent implements OnInit {
    @Select(CircuitState.circuits)
    public circuits$: Observable<CircuitDto[]>;

    public isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );

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
        // For easier dev
        this.createCircuit();
        // console.log(await this._storage.getCountdownTimer());
    }

    public async createCircuit(): Promise<void> {
        const modal = await this._modalService.createCircuit();
        const res = await modal.onDidDismiss();
        if (!!res.data) {
            console.log('create timer', res.data);
            await this._storage.saveCircuit(res.data);
        }
    }

    public slideChange(event: any): void {
        console.log('change slide', event);
        this.isPlaying$.next(false);
    }
}
