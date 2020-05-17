import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './pages';

@NgModule({
    declarations: [SettingsComponent],
    imports: [
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: SettingsComponent,
            },
            {
                path: '**',
                redirectTo: 'settings',
            },
        ]),
    ],
})
export class SettingsModule {}
