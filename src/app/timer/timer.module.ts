import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TimerHomeComponent } from './timer-home/timer-home.component';
import { TimerCreateComponent } from './timer-create/timer-create.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [TimerHomeComponent, TimerCreateComponent],
    imports: [
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: 'home',
                component: TimerHomeComponent
            },
            {
                path: 'create',
                component: TimerCreateComponent
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/timer/home'
            }
        ])
    ],
    exports: [TimerCreateComponent],
    entryComponents: [TimerCreateComponent]
})
export class TimerModule {}
