export class MenuItem {
    title: string = '';
    url: string = '';
    icon: string = '';

    constructor(params?: Partial<MenuItem>) {
        if (!!params) {
            this.title = params.title || this.title;
            this.url = params.url || this.url;
            this.icon = params.icon || this.icon;
        }
    }
}
