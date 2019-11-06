import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CountdownModule } from 'ngx-countdown';

import { TimerHomeComponent } from './pages';
import { TimerCountdownComponent } from './components';

@NgModule({
    declarations: [TimerHomeComponent, TimerCountdownComponent],
    imports: [
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        SharedModule,
        CountdownModule,
        RouterModule.forChild([
            {
                path: '',
                component: TimerHomeComponent
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: '/timer'
            }
        ])
    ]
})
export class TimerModule {}
