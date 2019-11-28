import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CircuitDto } from 'src/app/shared/models';
import { StorageService } from 'src/app/core/services';
import { IonSlides } from '@ionic/angular';

@Component({
    selector: 'app-circuit-view',
    templateUrl: './circuit-view.component.html',
    styleUrls: ['./circuit-view.component.scss']
})
export class CircuitViewComponent implements OnInit {
    @Input()
    public circuit: CircuitDto;

    @ViewChild('timers', { static: false }) timerSlides: IonSlides;

    /**
     * Options for ion-slider.
     */
    public slideOpts: any = {
        direction: 'vertical',
        centeredSlides: true,
        slidesPerView: 4,
        initialSlide: 0,
        speed: 400,
        renderBullet: (index, className): string => {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        }
    };

    constructor(private _storageService: StorageService) {}

    ngOnInit(): void {}

    public play(): void {
        console.log('play here');
    }
    public skip(): void {
        console.log('skip here');
    }
    public deleteCircuit(): void {
        this._storageService.deleteCircuit(this.circuit);
    }
}
