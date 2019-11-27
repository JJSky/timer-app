import { Component, OnInit, Input } from '@angular/core';
import { CircuitDto } from 'src/app/shared/models';
import { StorageService } from 'src/app/core/services';

@Component({
    selector: 'app-circuit-view',
    templateUrl: './circuit-view.component.html',
    styleUrls: ['./circuit-view.component.scss']
})
export class CircuitViewComponent implements OnInit {
    @Input()
    public circuit: CircuitDto;

    constructor(private _storageService: StorageService) {}

    ngOnInit(): void {}

    public deleteCircuit(): void {
        this._storageService.deleteCircuit(this.circuit);
    }
}
