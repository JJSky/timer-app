import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { take, tap, takeUntil, switchMap } from 'rxjs/operators';
import { ModalService, StorageService } from '@core/services';
import { CircuitState } from '@core/state';
import { CircuitDto } from '@shared/models';
import { IonSlides, Platform, MenuController } from '@ionic/angular';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { CircuitViewComponent } from '../../components';

@Component({
    selector: 'app-circuit-home',
    templateUrl: './circuit-home.component.html',
    styleUrls: ['./circuit-home.component.scss'],
})
export class CircuitHomeComponent implements OnInit {
    /**
     * Get circuits observable from state.
     */
    @Select(CircuitState.circuits)
    public circuits$: Observable<CircuitDto[]>;

    @Select(CircuitState.isPlaying)
    public isPlaying$: Observable<boolean>;

    /**
     * Access to IonSlides component.
     */
    private _slides: IonSlides;
    @ViewChild('slides', { static: false }) set slides(elRef: IonSlides) {
        this._slides = elRef;
    }

    /**
     * Access to circuit components.
     */
    @ViewChildren('circuitEl') public circuitEls: QueryList<CircuitViewComponent>;

    private _unsub: Subject<void> = new Subject();
    private subscription: Subscription;

    /**
     * Options for ion-slider.
     */
    public slideOpts$: Observable<any> = this.isPlaying$.pipe(
        takeUntil(this._unsub),
        switchMap((playing) => {
            return of({
                initialSlide: 0,
                speed: 400,
                renderBullet: (index, className): string => {
                    return '<span class="' + className + '">' + (index + 1) + '</span>';
                },
                onlyExternal: playing,
            });
        })
    );

    constructor(
        private _modalService: ModalService,
        private _storage: StorageService,
        private _platform: Platform,
        private _menu: MenuController
    ) {}

    ionViewDidEnter(): void {
        this.subscription = this._platform.backButton.subscribe(() => {
            navigator['app'].exitApp();
        });
    }
    ionViewWillLeave(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        // Only automatically open modal if no circuits exist already
        this.circuits$.pipe(takeUntil(this._unsub)).subscribe((circuits) => {
            if (!circuits) {
                console.log('try to create circuit on init');
                this.createCircuit();
            }
        });
    }
    ngOnDestroy(): void {
        this._unsub.next();
        this._unsub.complete();
    }

    public openMenu(): void {
        this._menu.open('side-menu');
    }

    public circuitTrackBy(index: number, item: CircuitDto): string {
        if (!item) {
            return null;
        }
        return item.id;
    }

    /**
     * Open modal to create a new circuit.
     * Save new circuit to local storage & state.
     */
    public async createCircuit(): Promise<void> {
        const modal = await this._modalService.openCreateCircuitModal();
        const res = await modal.onDidDismiss();
        if (!!res.data) {
            console.log('create circuit', res.data);
            await this._storage.saveCircuit(res.data);
            if (!!(await this._slides.length())) {
                const numSlides = await this._slides.length();
                this._slides.slideTo(numSlides);
            }
        }
    }

    /**
     * Edit circuit.
     */
    public async editCircuit(circuit: CircuitDto): Promise<void> {
        const alert = await this._modalService.openCreateCircuitModal(circuit);
        const res = await alert.onDidDismiss();
        if (!!res.data) {
            console.log('save edits to circuit', res.data);
            this._storage.updateCircuit(res.data);
        }
    }

    /**
     * Run whenever the ion-slider changes slides.
     */
    public async slideChange(event: any): Promise<void> {
        console.log('change slide', event);
        const els = this.circuitEls.toArray();
        const i = await this._slides.getActiveIndex();
        // TODO: Stop timer when swiping.
        els[i].pauseTimer();
    }

    /**
     * Animate to previous slide after circuit deletion.
     */
    public async deleteCircuit(): Promise<void> {
        this._slides.slidePrev();
        await this._slides.update();
    }
}
