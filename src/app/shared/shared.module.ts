import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { TimerCreateComponent } from "./modals";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [TimerCreateComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    entryComponents: [TimerCreateComponent]
})
export class SharedModule {}
