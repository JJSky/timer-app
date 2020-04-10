import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitControlsComponent } from './circuit-controls.component';

describe('CircuitControlsComponent', () => {
    let component: CircuitControlsComponent;
    let fixture: ComponentFixture<CircuitControlsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CircuitControlsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CircuitControlsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
