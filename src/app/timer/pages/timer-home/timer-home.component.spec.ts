import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerHomeComponent } from './timer-home.component';

describe('TimerHomeComponent', () => {
    let component: TimerHomeComponent;
    let fixture: ComponentFixture<TimerHomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TimerHomeComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TimerHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
