import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ModalService, StorageService } from '@core/services';
import { CircuitState } from '@core/state';
import { CircuitDto } from '@shared/models';

@Component({
    selector: 'app-circuit-home',
    templateUrl: './circuit-home.component.html',
    styleUrls: ['./circuit-home.component.scss']
})
export class CircuitHomeComponent implements OnInit {
    /** Gets circuits observable from state. */
    @Select(CircuitState.circuits)
    public circuits$: Observable<CircuitDto[]>;

    /** Returns whether a timer is playing or not. */
    public isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /** Options for ion-slider. */
    public slideOpts: any = {
        initialSlide: 0,
        speed: 400,
        renderBullet: (index, className): string => {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        }
    };

    constructor(private _modalService: ModalService, private _storage: StorageService) {}

    ngOnInit(): void {
        // Only automatically open modal if no circuits exist already
        this.circuits$.pipe(take(1)).subscribe(circuits => {
            if (!!!circuits) {
                this.createCircuit();
            }
        });
    }

    /**
     * Open modal to create a new circuit.
     * Save new circuit to local storage & state.
     */
    public async createCircuit(): Promise<void> {
        const modal = await this._modalService.openCreateCircuitModal();
        const res = await modal.onDidDismiss();
        if (!!res.data) {
            console.log('create timer', res.data);
            await this._storage.saveCircuit(res.data);
        }
    }

    /**
     * Run whenever the ion-slider changes slides.
     */
    public slideChange(event: any): void {
        console.log('change slide', event);
        this.isPlaying$.next(false);
    }
}
