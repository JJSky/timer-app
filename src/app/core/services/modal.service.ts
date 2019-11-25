import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CircuitCreateComponent } from '../../shared/modals/circuit-create/circuit-create.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    constructor(private _modalCtrl: ModalController) {}

    public async createCircuit(): Promise<HTMLIonModalElement> {
        const modal = await this._modalCtrl.create({
            component: CircuitCreateComponent
        });
        await modal.present();
        return modal;
    }
}
