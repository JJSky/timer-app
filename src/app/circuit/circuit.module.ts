import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CountdownModule } from 'ngx-countdown';

import { CircuitHomeComponent } from './pages';
import { components } from './components';

@NgModule({
    declarations: [CircuitHomeComponent, components],
    imports: [
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        SharedModule,
        CountdownModule,
        RouterModule.forChild([
            {
                path: '',
                component: CircuitHomeComponent,
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: '/home',
            },
        ]),
    ],
})
export class CircuitModule {}
