import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Settings } from '@shared/models';
import { SettingsState } from '@core/state';
import { Select } from '@ngxs/store';
import { take, takeUntil } from 'rxjs/operators';
import { StorageService } from '@core/services';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    @Select(SettingsState.settings)
    public settings$: Observable<Settings>;

    /**
     * Form for settings.
     */
    public settingsForm: FormGroup;

    /**
     * Handles unsubscribing.
     */
    private _unsub: Subject<void> = new Subject();

    constructor(private _fb: FormBuilder, private _storageService: StorageService) {}

    ngOnInit(): void {
        this.settings$.pipe(take(1)).subscribe((settings) => {
            const existingSettings = new Settings(settings);
            console.log('populate form with: ', existingSettings);
            // Initialize settings form
            this.settingsForm = this._fb.group({
                fireworks: [existingSettings.fireworks],
                darkMode: { value: existingSettings.darkMode, disabled: true },
                fullscreenCircuits: {
                    value: existingSettings.fullscreenCircuits,
                    disabled: true,
                },
                volume: [existingSettings.volume],
            });
        });

        this.settingsForm.valueChanges.pipe(takeUntil(this._unsub)).subscribe((s) => {
            const tenth = 10;
            const roundedVolume = Math.round(tenth * s.volume) / tenth;
            this._storageService.updateSettings(
                new Settings({
                    darkMode: s.darkMode,
                    fireworks: s.fireworks,
                    volume: roundedVolume,
                })
            );
        });
    }
    ngOnDestroy(): void {
        this._unsub.next();
        this._unsub.complete();
    }
}
