import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SoundService {
    public volume: number = 1;
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
        this._audio.volume = this.volume;

        this._audio.src = '/assets/alarm_clock.mp3';
        this._audio.load();
        this._audio.play();
    }
}
