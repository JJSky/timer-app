import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from './core/services';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private _platform: Platform,
        private _splashScreen: SplashScreen,
        private _statusBar: StatusBar,
        private _storageService: StorageService
    ) {
        this.initializeApp();
    }

    initializeApp(): void {
        this._platform.ready().then(() => {
            this._statusBar.styleDefault();
            this._splashScreen.hide();
        });

        // Restore timers
        this._storageService.restoreTimers();
    }
}
