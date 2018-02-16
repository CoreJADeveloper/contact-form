import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'ng-form-settings',
    templateUrl: './form-settings.component.html'
})

export class FormSettingsComponent{
    @Output() onFormSettingsChange = new EventEmitter<any>();

    private settings_data: any;

    public constructor(){
        this.generate_default_settings_data();
    }

    private onFormSettingsUpdated(event){
        this.onFormSettingsChange.emit(this.settings_data);
    }

    private generate_default_settings_data(){
        this.settings_data = JSON.parse(sessionStorage.getItem('ng_settings_data'));
        console.log(this.settings_data);
    }

    private update_anti_spam_honeybot(event){
        if(event.checked){
            this.settings_data.anti_span_honeybot = true;
        }else{
            this.settings_data.anti_span_honeybot = false;
        }
        this.onFormSettingsChange.emit(this.settings_data);
    }

    get emailMessage() {
        return this.settings_data.message;
    }

    set emailMessage(v) {
        this.settings_data.message = v;
        this.onFormSettingsChange.emit(this.settings_data);
    }

    private update_send_confirmation_email(event){
        if(event.checked){
            this.settings_data.send_confirmation_email = true;
        }else{
            this.settings_data.send_confirmation_email = false;
        }
        this.onFormSettingsChange.emit(this.settings_data);
    }

    get confirmationEmailMessage() {
        return this.settings_data.confirmation_email_message;
    }

    set confirmationEmailMessage(v) {
        this.settings_data.confirmation_email_message = v;
        this.onFormSettingsChange.emit(this.settings_data);
    }
}