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
import { AddFormViewComponent } from './forms/form-list/add-form/add-form.component';
import { AllFormsViewComponent } from './forms/form-list/all-forms/all-forms.component';
import { TextFieldViewComponent } from './forms/form-list/form-fields/textfield/textfield.component';
import { TextAreaViewComponent } from './forms/form-list/form-fields/textarea/textarea.component';
import { EmailFieldViewComponent } from './forms/form-list/form-fields/emailfield/emailfield.component';
import { NumberFieldViewComponent } from './forms/form-list/form-fields/numberfield/numberfield.component';
import { RadioButtonViewComponent } from './forms/form-list/form-fields/radiobutton/radiobutton.component';
import { CheckboxViewComponent } from './forms/form-list/form-fields/checkbox/checkbox.component';
import { DragTextFieldDirective, DropFieldsDirective } from './forms/form-list/add-form/add-form.directives';

import {MdTabsModule, MdInputModule, MdButtonModule, MdRadioModule, MdListModule, MdCardModule, MdCheckboxModule} from '@angular/material';

import {DragulaModule} from 'ng2-dragula/ng2-dragula';

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
        DragulaModule,
        MdTabsModule,
        MdInputModule,
        MdButtonModule,
        MdCardModule,
        MdListModule,
        MdRadioModule,
        MdCheckboxModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        FormsViewComponent,
        EmailViewComponent,
        MessageViewComponent,
        SettingsViewComponent,
        AdditionalSettingsViewComponent,
        FormListViewComponent,
        TextFieldViewComponent,
        TextAreaViewComponent,
        RadioButtonViewComponent,
        EmailFieldViewComponent,
        NumberFieldViewComponent,
        CheckboxViewComponent,
        AddFormViewComponent,
        AllFormsViewComponent,
        DragTextFieldDirective,
        DropFieldsDirective
    ],
    providers: [
    ]
})

export class AppModule {
}
