import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PickerOptions, PickerColumnOption } from '@ionic/core';
import { PickerController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CountdownTimer } from 'ngx-countdown';
import { TimerDto } from '../../models';

@Component({
    selector: 'app-timer-create',
    templateUrl: './timer-create.component.html',
    styleUrls: ['./timer-create.component.scss']
})
export class TimerCreateComponent implements OnInit {
    public timerForm: FormGroup;
    public minutes: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public seconds: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public errors: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
        []
    );
    public generatedName: string =
        'Timer#' + Math.floor(1000 + Math.random() * 9000);

    constructor(
        private _fb: FormBuilder,
        private _pickerCtrl: PickerController,
        private _modalCtrl: ModalController
    ) {}

    ngOnInit(): void {
        const maxMinutes = 59;
        const maxSeconds = 59;
        this.timerForm = this._fb.group({
            name: [''],
            minutes: [0, [Validators.min(0), Validators.max(maxMinutes)]],
            seconds: [0, [Validators.min(0), Validators.max(maxSeconds)]]
        });
    }

    public async createTimer({
        valid,
        value
    }: {
        valid: any;
        value: TimerDto;
    }): Promise<void> {
        const errArray = [];

        // Validate minutes and seconds
        if (value.minutes <= 0 && value.seconds <= 0) {
            errArray.push('Timer cannot have no time');
        }
        this.errors.next(errArray);
        if (errArray.length) {
            console.log('there are errors, stop submission', errArray);
            return;
        }

        // If no name filled in, use generated name
        if (!value.name) {
            this.timerForm.controls.name.setValue(this.generatedName);
            value.name = this.generatedName;
        }

        // Calculate number of miliseconds in timer
        const milisecondsInMinute = 60000;
        const milisecondsInSecond = 1000;
        value.totalTime =
            this.minutes.value * milisecondsInMinute +
            this.seconds.value * milisecondsInSecond;

        this.dismiss(value);
    }

    public dismiss(data?: any): void {
        this._modalCtrl.dismiss(data);
    }

    public async chooseTime(): Promise<void> {
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
                    selectedIndex: this.minutes.value
                },
                {
                    name: 'seconds',
                    options: secondsOptions,
                    selectedIndex: this.seconds.value
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
            if (!canceled) {
                this.minutes.next(minCol.options[minCol.selectedIndex].value);
                this.seconds.next(secCol.options[secCol.selectedIndex].value);
                this.timerForm
                    .get('minutes')
                    .setValue(minCol.options[minCol.selectedIndex].value);
                this.timerForm
                    .get('seconds')
                    .setValue(secCol.options[secCol.selectedIndex].value);
            }
        });
    }
}
