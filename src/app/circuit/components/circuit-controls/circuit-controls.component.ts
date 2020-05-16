import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CircuitState } from '@core/state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-circuit-controls',
    templateUrl: './circuit-controls.component.html',
    styleUrls: ['./circuit-controls.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircuitControlsComponent implements OnInit {
    @Input()
    public isPlaying: boolean = false;
    @Input()
    public circuitComplete: boolean;
    @Input()
    public percentComplete: number = 0;
    @Output()
    public play: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public delete: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public skip: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public edit: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public reset: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {}

    /** If circuit is complete, emit to reset. Otherwise play. */
    public playOrReset(): void {
        if (!!this.circuitComplete) {
            this.reset.emit();
        } else {
            this.play.emit();
        }
    }
}
