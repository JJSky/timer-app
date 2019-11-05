import { Component, OnInit } from "@angular/core";
import { ModalService } from "src/app/core/services/modal.service";

@Component({
    selector: "app-timer-home",
    templateUrl: "./timer-home.component.html",
    styleUrls: ["./timer-home.component.scss"]
})
export class TimerHomeComponent implements OnInit {
    public slideOpts: any = {
        initialSlide: 0,
        speed: 400
    };

    constructor(private _modalService: ModalService) {}

    ngOnInit(): void {}

    public async createTimer(): Promise<void> {
        const modal = await this._modalService.createTimer();
        const res = await modal.onDidDismiss();
        if (!!res.data) {
            console.log(res.data);
        }
    }
}
