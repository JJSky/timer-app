import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { CircuitCreateComponent } from './modals';
import { models } from './models';

@NgModule({
    declarations: [CircuitCreateComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    entryComponents: [CircuitCreateComponent],
    providers: [models]
})
export class SharedModule {}
