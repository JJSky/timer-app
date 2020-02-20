import { Component, OnInit, QueryList, ViewChildren, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { PickerOptions, PickerColumnOption } from '@ionic/core';
import { PickerController, ModalController, IonItemSliding } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { TimerDto, CircuitDto } from '@shared/models';
const uuidv1 = require('uuid/v1');

const maxMinutes = 59;
const maxSeconds = 59;
@Component({
    selector: 'app-circuit-create',
    templateUrl: './circuit-create.component.html',
    styleUrls: ['./circuit-create.component.scss']
})
export class CircuitCreateComponent implements OnInit {
    /** Existing circuit (if editing). */
    @Input() circuit: CircuitDto;

    /** Get element reference to list of IonItemSliding elements. */
    @ViewChildren('slideable') slidables: QueryList<IonItemSliding>;

    /** Form for a circuit and the timers within it. */
    public circuitForm: FormGroup;

    /** Array for holding errors from manual form validation. */
    public errors$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    /** Validation error messages defined here. */
    public validationMessages: any = {
        circuitName: [{ type: 'required', message: 'Circuit name is required.' }],
        timer: [{ type: 'min', message: 'An amount of time is required.' }]
    };

    constructor(
        private _fb: FormBuilder,
        private _pickerCtrl: PickerController,
        private _modalCtrl: ModalController
    ) {}

    ngOnInit(): void {
        // Initialize circuit form
        this.circuitForm = this._fb.group({
            circuitName: [this.circuit ? this.circuit.name : '', [Validators.required]],
            timers: this._fb.array([])
        });

        // If editing, populate timers
        if (!!this.circuit) {
            for (const timer of this.circuit.timers) {
                this.addTimer(timer);
            }
        } else {
            this.addTimer();
            // Show user there are hidden slide options
            this.peekSlideItem();
        }
    }

    /**
     * Animates first item in IonItemSlide to demonstrate that
     * there are hidden actions available from swiping on the item.
     */
    public peekSlideItem(): void {
        const peekDelay = 500;
        const peekTime = 800;

        setTimeout(() => {
            const ionSlideItemArray = this.slidables.toArray();
            ionSlideItemArray[0].open('end');
            setTimeout(() => {
                ionSlideItemArray[0].close();
            }, peekTime);
        }, peekDelay);
    }

    /**
     * Check if field is valid based on validation type.
     * @param field Form field to validate.
     * @param type Type of validation to perform on field.
     */
    public isValid(field: FormControl, type: string): boolean {
        return field.hasError(type) && (field.dirty || field.touched);
    }

    // ~~~~~~~~~~~~~~~~~~ Form array stuff starts here ~~~~~~~~~~~~~~~~~~
    /** Get reference to timers FormArray from circuitForm. */
    public get timersFormArray(): FormArray {
        return this.circuitForm.get('timers') as FormArray;
    }

    /** Add timer to timers FormArray. */
    public addTimer(timer?: TimerDto): void {
        this.timersFormArray.push(this.createTimer(timer));
    }

    /** Returns new formgroup for a timer. */
    public createTimer(timer?: TimerDto): FormGroup {
        return this._fb.group({
            name: timer ? timer.name : '',
            minutes: [timer ? timer.minutes : 0, [Validators.min(0), Validators.max(maxMinutes)]],
            seconds: [
                timer ? timer.seconds : 0,
                [Validators.min(timer ? timer.minutes : 0), Validators.max(maxSeconds)]
            ],
            totalTime: [timer ? timer.totalTime : 0, [Validators.required, Validators.min(1)]]
        });
    }

    /**
     * Delete timer from timers FormArray.
     * @param index Index of timer to delete.
     */
    public deleteTimer(index: number): void {
        this.timersFormArray.controls.splice(index, 1);
    }

    /**
     * Handle updating formArray when dragging ion-reorder
     * @param event Drop event.
     */
    public doReorder(event: any): void {
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
    // ~~~~~~~~~~~~~~~~~~ Form array stuff ends here ~~~~~~~~~~~~~~~~~~

    /**
     * Select minutes and seconds for individual timer.
     * @param timer Autofill picker with previously selected values.
     */
    public async chooseTime(timer: FormGroup): Promise<void> {
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
                    .setValue(minutes * milisecondsInMinute + seconds * milisecondsInSecond);
            }
        });
    }

    /**
     * Submit circuit form by dismissing modal with circuit data.
     */
    public async submitCircuit({
        valid,
        value
    }: {
        valid: boolean;
        value: { circuitName: string; timers: TimerDto[] };
    }): Promise<void> {
        console.log('form value', valid, value);
        // Manual validation (hopefully don't need)
        const errArray = [];
        for (const t of value.timers) {
            if (t.totalTime <= 0) {
                errArray.push('Timer cannot have no time');
            }
        }
        this.errors$.next(errArray);
        if (errArray.length || !valid) {
            console.log('there are errors, stop submission', errArray);
            return;
        }

        const newCircuit = new CircuitDto({
            id: this.circuit ? this.circuit.id : uuidv1(),
            name: value.circuitName,
            timers: []
        });

        for (const [index, timer] of value.timers.entries()) {
            console.log('timer from form: ', timer, index);

            // If no name filled in for timer, generate name
            if (!!!timer.name) {
                timer.name = value.circuitName + ' Timer #' + (index + 1);
            }

            const newTimer = new TimerDto({
                id: this.circuit.timers[index] ? this.circuit.timers[index].id : uuidv1(),
                name: timer.name,
                minutes: timer.minutes,
                seconds: timer.seconds,
                totalTime: timer.totalTime
            });
            newCircuit.timers.push(newTimer);
        }

        console.log(newCircuit);
        this.dismiss(newCircuit);
    }

    /**
     * Dismiss modal with or without data.
     * @param data Data to pass to parent component.
     */
    public dismiss(data?: any): void {
        this._modalCtrl.dismiss(data);
    }
}
