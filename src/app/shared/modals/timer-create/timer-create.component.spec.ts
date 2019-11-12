import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerCreateComponent } from './timer-create.component';

describe('TimerCreateComponent', () => {
    let component: TimerCreateComponent;
    let fixture: ComponentFixture<TimerCreateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TimerCreateComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TimerCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
