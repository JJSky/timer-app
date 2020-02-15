import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy
} from '@angular/core';

@Component({
    selector: 'app-circuit-fabs',
    templateUrl: './circuit-fabs.component.html',
    styleUrls: ['./circuit-fabs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircuitFabsComponent implements OnInit {
    @Input()
    public isCountingDown: boolean;

    @Input()
    public circuitComplete: boolean;

    @Output()
    public play: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public delete: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public skip: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {}
}
