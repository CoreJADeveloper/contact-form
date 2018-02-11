import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {NgModule}      from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
//import { FormsViewComponent } from './forms/forms.component';
import { EmailViewComponent } from './email/email.component';
import { MessageViewComponent } from './message/message.component';
import { SettingsViewComponent } from './settings/settings.component';
import { AdditionalSettingsViewComponent } from './additional-settings/additional-settings.component';
//import { FormListViewComponent } from './forms/form-list/form-list.component';
//import { AddFormViewComponent } from './forms/form-list/add-form/add-form.component';
//import { AllFormsViewComponent } from './forms/form-list/all-forms/all-forms.component';
//import { TextFieldViewComponent, TextfieldSettingsDialog } from './forms/form-list/form-fields/textfield/textfield.component';
//import { TextAreaViewComponent, TextareaSettingsDialog } from './forms/form-list/form-fields/textarea/textarea.component';
//import { EmailFieldViewComponent, EmailfieldSettingsDialog } from './forms/form-list/form-fields/emailfield/emailfield.component';
//import { NumberFieldViewComponent, NumberfieldSettingsDialog } from './forms/form-list/form-fields/numberfield/numberfield.component';
//import { RadioButtonViewComponent, RadiobuttonSettingsDialog } from './forms/form-list/form-fields/radiobutton/radiobutton.component';
//import { CheckboxViewComponent, CheckboxSettingsDialog } from './forms/form-list/form-fields/checkbox/checkbox.component';
// import { DragTextFieldDirective, DropFieldsDirective } from './forms/form-list/add-form/add-form.directives';

//import {MatDialogModule, MatTabsModule, MatInputModule, MatButtonModule, MatRadioModule, MatListModule, MatCardModule, MatCheckboxModule, MatIconModule} from '@angular/material';

import {FormSetupComponent} from './form-setup/form-setup.component';

import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';

import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import {EditFormComponent} from "./edit-form/edit-form.component";
//import {AddFormService} from "./forms/form-list/add-form/add-form.service";
//import {AddFormDirective} from "./forms/form-list/add-form/add-form.directives";

@NgModule({
    bootstrap: [
        AppComponent,
        // CheckboxSettingsDialog
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
        //MdIconModule,
        //MdDialogModule,
        //MdTabsModule,
        //MdInputModule,
        //MdButtonModule,
        //MdCardModule,
        //MdListModule,
        //MdRadioModule,
        //MdCheckboxModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        //FormsViewComponent,
        EmailViewComponent,
        MessageViewComponent,
        SettingsViewComponent,
        AdditionalSettingsViewComponent,
        FormSetupComponent,
        EditFormComponent
    ],
    entryComponents: [
        FormSetupComponent
    ],
    providers: [RouterModule]
})

export class AppModule {
}
