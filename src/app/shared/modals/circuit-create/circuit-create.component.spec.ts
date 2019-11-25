import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitCreateComponent } from './circuit-create.component';

describe('CircuitCreateComponent', () => {
    let component: CircuitCreateComponent;
    let fixture: ComponentFixture<CircuitCreateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CircuitCreateComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CircuitCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
