import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { CircuitCreateComponent } from './modals';
import { TimerDto, CircuitDto, MenuItem, Settings } from './models';

@NgModule({
    declarations: [CircuitCreateComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    entryComponents: [CircuitCreateComponent],
    providers: [],
})
export class SharedModule {}
