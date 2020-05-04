import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '@core/services';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'environments/environment';
import { states } from '@core/state';
import { services } from '@core/services';
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
    providers: [StorageService, Storage],
})
export class CoreModule {}
