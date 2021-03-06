import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { CountdownModule } from 'ngx-countdown';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        CoreModule,
        SharedModule,
        CountdownModule,
        NgxsModule,
        NgxsEmitPluginModule,
        NgxsReduxDevtoolsPluginModule,
        IonicModule.forRoot(),
        RouterModule.forRoot([
            {
                path: 'home',
                loadChildren: (): any =>
                    import('./circuit/circuit.module').then((m) => m.CircuitModule),
            },
            {
                path: 'settings',
                loadChildren: (): any =>
                    import('./settings/settings.module').then((m) => m.SettingsModule),
            },
            {
                path: 'public',
                loadChildren: (): any =>
                    import('./public/public.module').then((m) => m.PublicModule),
            },
            {
                path: '**',
                redirectTo: 'home',
            },
        ]),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
