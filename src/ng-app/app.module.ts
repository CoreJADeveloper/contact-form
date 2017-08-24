import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {NgModule}      from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent }   from './app.component';
import { FormsViewComponent } from './forms/forms.component';
import { EmailViewComponent } from './email/email.component';
import { MessageViewComponent } from './message/message.component';
import { SettingsViewComponent } from './settings/settings.component';
import { AdditionalSettingsViewComponent } from './additional-settings/additional-settings.component';
import { FormListViewComponent } from './forms/form-list/form-list.component';

import {MdTabsModule, MdInputModule, MdButtonModule, MdTableModule} from '@angular/material';

const routes: Routes = [
    { path: 'page=ang-contact-form', component: AppComponent }
];

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        MdTabsModule,
        MdInputModule,
        MdButtonModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        FormsViewComponent,
        EmailViewComponent,
        MessageViewComponent,
        SettingsViewComponent,
        AdditionalSettingsViewComponent,
        FormListViewComponent
    ],
    providers: [
    ]
})

export class AppModule {
}
