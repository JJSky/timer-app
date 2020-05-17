import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from './core/services';
import { MenuItem } from '@shared/models';
import { Router, RouterEvent } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    public selectedPath: string = '';
    public menuPages: MenuItem[] = [
        new MenuItem({
            title: 'Public Circuits',
            url: '/public',
            icon: 'cloud',
        }),
        new MenuItem({
            title: 'Settings',
            url: '/settings',
            icon: 'settings',
        }),
    ];

    constructor(
        private _platform: Platform,
        private _splashScreen: SplashScreen,
        private _statusBar: StatusBar,
        private _storageService: StorageService,
        private _navCtrl: NavController,
        private _router: Router
    ) {
        this.initializeApp();

        this._router.events.subscribe((event: RouterEvent) => {
            this.selectedPath = event.url;
        });
    }

    private initializeApp(): void {
        this._platform.ready().then(() => {
            this._statusBar.styleDefault();
            this._splashScreen.hide();
        });

        // Restore timers
        this._storageService.restoreCircuits();
        this._storageService.restoreSettings();
    }

    public goToSettings(): void {
        console.log('navigate to settings plz');
        this._navCtrl.navigateRoot('/settings');
    }
}
