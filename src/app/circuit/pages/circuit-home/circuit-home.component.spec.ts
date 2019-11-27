import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitHomeComponent } from './circuit-home.component';

describe('CircuitHomeComponent', () => {
    let component: CircuitHomeComponent;
    let fixture: ComponentFixture<CircuitHomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CircuitHomeComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CircuitHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
