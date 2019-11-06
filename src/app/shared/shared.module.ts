import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { TimerCreateComponent } from './modals';
import { CountdownTimer } from './models';

@NgModule({
    declarations: [TimerCreateComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    entryComponents: [TimerCreateComponent]
})
export class SharedModule {}
