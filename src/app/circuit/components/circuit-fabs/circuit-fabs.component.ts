import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-circuit-fabs',
    templateUrl: './circuit-fabs.component.html',
    styleUrls: ['./circuit-fabs.component.scss']
})
export class CircuitFabsComponent implements OnInit {
    @Output()
    public play: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public delete: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public skip: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {}
}
