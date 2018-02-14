import { Component } from '@angular/core';

@Component({
    selector: 'ng-settings',
    templateUrl: './settings.component.html'
})

export class SettingsComponent {

    private global_settings: any;

    public constructor(){
        this.generate_global_settings();
    }

    private generate_global_settings(){
        this.global_settings = {
            text_message: '* Please enter text',
            number_message: '* Please enter number',
            confirm_number_message: '* Please enter only number',
            email_message: '* Please enter email address',
        };
    }
}