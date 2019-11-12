import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './services';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { states } from './state';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        NgxsModule.forRoot(states, {
            developmentMode: !environment.production
        }),
        NgxsEmitPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: environment.production
        })
    ],
    entryComponents: [],
    providers: [StorageService, Storage]
})
export class CoreModule {}
