import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitViewComponent } from './circuit-view.component';

describe('CircuitViewComponent', () => {
    let component: CircuitViewComponent;
    let fixture: ComponentFixture<CircuitViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CircuitViewComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CircuitViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
