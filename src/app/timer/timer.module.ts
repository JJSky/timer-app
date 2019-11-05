import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { TimerHomeComponent } from "./pages";
import { TimerCountdownComponent } from "./components";

@NgModule({
    declarations: [TimerHomeComponent, TimerCountdownComponent],
    imports: [
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: "home",
                component: TimerHomeComponent
            },
            {
                path: "**",
                pathMatch: "full",
                redirectTo: "/timer/home"
            }
        ])
    ]
})
export class TimerModule {}
