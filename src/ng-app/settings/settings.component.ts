import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ng-settings',
    templateUrl: './settings.component.html'
})

export class SettingsComponent implements OnInit{
    @Input() default_global_settings;
    @Output() onGlobalSettingsChanges = new EventEmitter<any>();

    private global_settings: any;

    public constructor(){
        //this.generate_global_settings();
    }

    ngOnInit(){
        this.global_settings = this.default_global_settings;

        //console.log(this.global_settings);
    }

    private on_global_settings_changes(event){
        this.onGlobalSettingsChanges.emit(this.global_settings);
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