import { Component, OnInit, Input } from '@angular/core';
import { TimerDto } from '@shared/models';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
    selector: 'app-circuit-timer',
    templateUrl: './circuit-timer.component.html',
    styleUrls: ['./circuit-timer.component.scss'],
})
export class CircuitTimerComponent implements OnInit {
    @Input()
    public timer: TimerDto;
    @Input()
    public active: boolean = false;

    private _play$: Subject<void> = new Subject();
    @Input()
    public set play(value: any) {
        this._play$.next(value);
    }

    private _unsub: Subject<void> = new Subject();

    constructor() {}

    ngOnInit(): void {
        this._play$
            .pipe(
                takeUntil(this._unsub),
                filter((_) => this.active)
            )
            .subscribe((res) => console.log('play did a thing'));
    }
    ngOnDestroy(): void {
        this._unsub.next();
        this._unsub.complete();
    }
}
