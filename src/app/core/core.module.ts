import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'environments/environment';
import { StorageService } from '../core/services';
import { states } from '../core/state';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        NgxsModule.forRoot(states, {
            developmentMode: !environment.production,
        }),
        NgxsEmitPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: environment.production,
        }),
    ],
    entryComponents: [],
    providers: [StorageService],
})
export class CoreModule {}
