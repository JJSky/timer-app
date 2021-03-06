import { Injectable } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { CircuitCreateComponent } from '@shared/modals';
import { CircuitDto } from '@shared/models';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(private _modalCtrl: ModalController, private _alertCtrl: AlertController) {}

    /** Open modal for creating/editing a circuit. */
    public async openCreateCircuitModal(circuitToEdit?: CircuitDto): Promise<HTMLIonModalElement> {
        const modal = await this._modalCtrl.create({
            component: CircuitCreateComponent,
            componentProps: {
                circuit: circuitToEdit,
            },
        });
        await modal.present();
        return modal;
    }

    /** Open circuit deletion confirmation alert. */
    public async confirmCircuitDeleteModal(circuit: CircuitDto): Promise<HTMLIonAlertElement> {
        const alert = await this._alertCtrl.create({
            header: 'Delete circuit?',
            message: `Are you sure you want to delete ${circuit.name}?`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: (): boolean => {
                        alert.dismiss();
                        return false;
                    },
                },
                {
                    text: 'Delete',
                    handler: (): boolean => {
                        alert.dismiss(circuit.id);
                        return false;
                    },
                },
            ],
        });
        await alert.present();
        return alert;
    }
}
