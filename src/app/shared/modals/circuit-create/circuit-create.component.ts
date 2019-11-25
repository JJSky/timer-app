import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormArray,
    Form,
    FormControl
} from '@angular/forms';
import { PickerOptions, PickerColumnOption } from '@ionic/core';
import {
    PickerController,
    ModalController,
    IonItemSliding
} from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { TimerDto, CircuitDto } from '../../models';
const uuidv1 = require('uuid/v1');

@Component({
    selector: 'app-circuit-create',
    templateUrl: './circuit-create.component.html',
    styleUrls: ['./circuit-create.component.scss']
})
export class CircuitCreateComponent implements OnInit {
    @ViewChild('swipeable', { static: false }) swipeable: any;

    public timers: any;
    public circuitForm: FormGroup;
    public errors$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
        []
    );
    public validationMessages: any = {
        circuitName: [
            { type: 'required', message: 'Circuit name is required.' }
        ],
        timer: [{ type: 'min', message: 'An amount of time is required.' }]
    };

    constructor(
        private _fb: FormBuilder,
        private _pickerCtrl: PickerController,
        private _modalCtrl: ModalController
    ) {}

    ngOnInit(): void {
        this.circuitForm = this._fb.group({
            circuitName: ['', [Validators.required]],
            timers: this._fb.array([this.createTimer()])
        });
        this.peekSlideItem();
    }

    public peekSlideItem(): void {
        const peekTime = 1000;
        console.log(this.swipeable);
        // this.swipeable.open('end');
        // setTimeout(() => {
        //     this.swipeable.close();
        // }, peekTime);
    }

    public isValid(field: FormControl, type: string): boolean {
        return field.hasError(type) && (field.dirty || field.touched);
    }

    // Form array stuff starts here
    public createTimer(): FormGroup {
        const maxMinutes = 59;
        const maxSeconds = 59;
        return this._fb.group({
            name: '',
            minutes: [0, [Validators.min(0), Validators.max(maxMinutes)]],
            seconds: [0, [Validators.min(0), Validators.max(maxSeconds)]],
            totalTime: [0, [Validators.required, Validators.min(1)]]
        });
    }
    public addTimer(): void {
        this.timersFormArray.push(this.createTimer());
    }
    public deleteTimer(index: number): void {
        this.timersFormArray.controls.splice(index, 1);
    }
    public get timersFormArray(): FormArray {
        return this.circuitForm.get('timers') as FormArray;
    }
    public doReorder(event: any): void {
        // Handle updating formArray when dragging ion-reorder
        const dir = event.detail.to > event.detail.from ? 1 : -1;

        const from = event.detail.from;
        const to = event.detail.to;

        const temp = this.timersFormArray.at(from);
        for (let i = from; i * dir < to * dir; i = i + dir) {
            const current = this.timersFormArray.at(i + dir);
            this.timersFormArray.setControl(i, current);
        }
        this.timersFormArray.setControl(to, temp);
        event.detail.complete();
    }
    // Form array stuff ends here

    public async chooseTime(timer: FormGroup, index: number): Promise<void> {
        let canceled = false;
        const minutesInHour = 60;
        const secondsInMinute = 60;
        const minutesOptions: Array<PickerColumnOption> = [];
        const secondsOptions: Array<PickerColumnOption> = [];
        for (let i = 0; i < minutesInHour; i++) {
            const formattedIndex = i.toLocaleString('en-us', {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
            minutesOptions.push({ value: i, text: formattedIndex });
        }
        for (let i = 0; i < secondsInMinute; i++) {
            const formattedIndex = i.toLocaleString('en-us', {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
            secondsOptions.push({ value: i, text: formattedIndex });
        }
        const opts: PickerOptions = {
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: (value: any): void => {
                        canceled = true;
                    }
                },
                {
                    text: 'Done'
                }
            ],
            columns: [
                {
                    name: 'minutes',
                    options: minutesOptions,
                    selectedIndex: timer.get('minutes').value
                },
                {
                    name: 'seconds',
                    options: secondsOptions,
                    selectedIndex: timer.get('seconds').value
                }
            ]
        };

        const picker = await this._pickerCtrl.create(opts);

        // This fixes overlapping options bug in the picker
        picker.columns[0].options.forEach(element => {
            delete element.selected;
            delete element.duration;
            delete element.transform;
        });

        picker.present();
        picker.onDidDismiss().then(async data => {
            const minCol = await picker.getColumn('minutes');
            const secCol = await picker.getColumn('seconds');

            const milisecondsInMinute = 60000;
            const milisecondsInSecond = 1000;
            if (!canceled) {
                const minutes = minCol.options[minCol.selectedIndex].value;
                const seconds = secCol.options[secCol.selectedIndex].value;
                timer.get('minutes').setValue(minutes);
                timer.get('seconds').setValue(seconds);
                timer
                    .get('totalTime')
                    .setValue(
                        minutes * milisecondsInMinute +
                            seconds * milisecondsInSecond
                    );
            }
        });
    }

    public async submitCircuit({
        valid,
        value
    }: {
        valid: any;
        value: any;
    }): Promise<void> {
        console.log('form value', valid, value);
        if (!valid) {
            return;
        }

        const newCircuit = new CircuitDto({
            name: value.circuitName,
            timers: []
        });

        // If no name filled in for any timers, generate name
        value.timers.forEach((timer, index) => {
            if (!timer.name) {
                timer.name = value.circuitName + ' Timer #' + (index + 1);
            }

            const newTimer = new TimerDto({
                id: uuidv1(),
                name: timer.name,
                minutes: timer.minutes,
                seconds: timer.seconds,
                totalTime: timer.totalTime
            });
            newCircuit.timers.push(newTimer);
        });

        // Manual validation (hopefully don't need)
        // const errArray = [];
        // value.timers.forEach(timer => {
        //     if (timer.minutes <= 0 || timer.seconds <= 0) {
        //         errArray.push('Timer cannot have no time');
        //     }
        // });
        // this.errors$.next(errArray);
        // if (errArray.length) {
        //     console.log('there are errors, stop submission', errArray);
        //     return;
        // }

        console.log(newCircuit);
        this.dismiss(newCircuit);
    }

    public dismiss(data?: any): void {
        this._modalCtrl.dismiss(data);
    }
}
