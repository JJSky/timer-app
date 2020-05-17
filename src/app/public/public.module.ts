import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PublicCircuitsComponent } from './pages';

@NgModule({
    declarations: [PublicCircuitsComponent],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: PublicCircuitsComponent,
            },
            {
                path: '**',
                redirectTo: 'public',
            },
        ]),
    ],
})
export class PublicModule {}
