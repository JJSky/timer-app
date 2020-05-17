import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { SettingsState } from '../state';
import { Observable, BehaviorSubject } from 'rxjs';
import { Settings } from '@shared/models';
import { pluck, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SoundService {
    @Select(SettingsState.settings)
    public settings$: Observable<Settings>;

    public volume$: Observable<number> = this.settings$.pipe(pluck('volume'));
    private _audio: HTMLAudioElement = new Audio();
    private _isPlaying: boolean = false;

    constructor() {}

    public playCompleteSound(): void {
        // Pause/reset audio if previous one hasn't completed
        if (!this._audio.ended) {
            this._audio.pause();
            this._audio.currentTime = 0;
        }

        // Set volume
        this.volume$.pipe(take(1)).subscribe((v) => {
            this._audio.volume = v;
        });

        this._audio.src = '/assets/alarm_clock.mp3';
        this._audio.load();
        this._audio.play();
    }
}
