export class TimerDto {
    id: string = '';
    name: string = '';
    minutes: number = 0;
    seconds: number = 0;
    totalTime: number = 0;

    constructor(params?: Partial<TimerDto>) {
        if (!!params) {
            this.id = params.id || this.id;
            this.name = params.name || this.name;
            this.minutes = params.minutes || this.minutes;
            this.seconds = params.seconds || this.seconds;
            this.totalTime = params.totalTime || this.totalTime;
        }
    }
}
