import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {NgModule}      from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import {FormSetupComponent} from './form-setup/form-setup.component';

import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import {EditFormComponent} from "./edit-form/edit-form.component";
import {FormSettingsComponent} from "./form-settings/form-settings.component";

@NgModule({
    bootstrap: [
        AppComponent,
    ],
    imports: [
        RouterModule,
        FormsModule,
        BrowserModule,
        HttpModule,
        DragulaModule,
        MatInputModule,
        MatTabsModule,
        MatCardModule,
        MatFormFieldModule,
        MatGridListModule,
        MatListModule,
        MatIconModule,
        MatChipsModule,
        MatCheckboxModule,
        MatRadioModule,
        MatButtonModule,
        MatDividerModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        SettingsComponent,
        FormSetupComponent,
        EditFormComponent,
        FormSettingsComponent
    ],
    entryComponents: [
        FormSetupComponent
    ],
    providers: [RouterModule]
})

export class AppModule {
}
