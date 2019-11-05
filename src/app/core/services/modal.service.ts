import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { TimerCreateComponent } from "../../shared/modals/timer-create/timer-create.component";

@Injectable({
    providedIn: "root"
})
export class ModalService {
    constructor(private _modalCtrl: ModalController) {}

    public async createTimer(): Promise<HTMLIonModalElement> {
        const modal = await this._modalCtrl.create({
            component: TimerCreateComponent
        });
        await modal.present();
        return modal;
    }
}
