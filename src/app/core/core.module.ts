import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './services';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    entryComponents: [],
    providers: [StorageService, Storage]
})
export class CoreModule {}
