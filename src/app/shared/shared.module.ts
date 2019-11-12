import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { TimerCreateComponent } from './modals';
import { TimerDto } from './models';

@NgModule({
    declarations: [TimerCreateComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    entryComponents: [TimerCreateComponent],
    providers: [TimerDto]
})
export class SharedModule {}
