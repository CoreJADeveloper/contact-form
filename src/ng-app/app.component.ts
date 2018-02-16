import 'rxjs/add/operator/let';
import { Component, Input, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

export var WPAPI = require('wpapi');

@Component({
    selector: 'contact-form',
    templateUrl: './app.component.html'
})

export class AppComponent implements AfterViewChecked {

    private endpoint:string;
    private nonce:string;
    private component_type:string;
    private form_id:any;
    private selectedTab:any;

    //private form_setup:any;
    //private form_fields:any;
    //private settings_data:any;

    //private check_data_loaded:boolean = false;

    private blank_fields:any;
    private basic_fields:any;
    private default_form_settings:any;

    private form_title:string;

    private updated_form_fields:any;
    private updated_form_settings:any;
    private load_update_form_spinner: boolean = false;
    private load_update_global_settings_spinner: boolean = false;
    private default_global_settings: any;
    private global_settings: any;

    public constructor(public elementRef:ElementRef) {
        let native_element = this.elementRef.nativeElement;
        this.endpoint = native_element.getAttribute("endpoint");
        this.nonce = native_element.getAttribute("nonce");
        this.component_type = native_element.getAttribute("type");

        if (this.component_type == 'edit') {
            this.updated_form_fields = JSON.parse(sessionStorage.getItem('ng_form_fields'));
            this.updated_form_settings = JSON.parse(sessionStorage.getItem('ng_settings_data'));
            this.form_id = native_element.getAttribute("form_id");
            sessionStorage.setItem('ng_form_id', this.form_id);

            this.form_title = sessionStorage.getItem('ng_form_title');
        }

        this.selectedTab = 1;

        //sessionStorage.setItem('ng_site_endpoint', this.endpoint);
        //sessionStorage.setItem('ng_site_nonce', this.nonce);
        //sessionStorage.setItem('ng_default_form_action', this.component_type);

        this.blank_fields = [
            {
                type: 'submit',
                label: 'Send',
                built_classes: 'ng-form-field ng-submit',
                classes: '',
                position: [
                    {
                        text: 'left',
                    },
                    {
                        text: 'right',

                    }
                ],
                position_checked: 0,
            }
        ];

        this.basic_fields =
            [
                {
                    type: 'text',
                    label: 'Name',
                    hide_label: false,
                    built_classes: 'ng-form-field ng-text',
                    classes: '',
                    required: false,
                    description: '',
                    placeholder: '',
                    default_value: '',
                },
                {
                    type: 'text',
                    label: 'Title',
                    hide_label: false,
                    built_classes: 'ng-form-field ng-text',
                    classes: '',
                    required: false,
                    description: '',
                    placeholder: '',
                    default_value: '',
                },
                {
                    type: 'textarea',
                    label: 'Description',
                    hide_label: false,
                    built_classes: 'ng-form-field ng-textarea',
                    classes: '',
                    rows: 5,
                    required: false,
                    description: '',
                    placeholder: '',
                    default_value: '',
                },
                {
                    type: 'submit',
                    label: 'Send',
                    built_classes: 'ng-form-field ng-submit',
                    classes: '',
                    position: [
                        {
                            text: 'left',
                        },
                        {
                            text: 'right',

                        }
                    ],
                    position_checked: 0,
                }
            ];
        //sessionStorage.setItem('ng_basic_fields', JSON.stringify(this.basic_fields));
        //sessionStorage.setItem('ng_blank_fields', JSON.stringify(this.blank_fields));

        this.default_form_settings = {
            form_name: '',
            form_css_classes: '',
            submit_button_processing_text: 'Please wait...',
            anti_span_honeybot: false,
            send_to_email: '{admin_email}',
            email_subject: '{site_title}',
            from_name: '{admin_name}',
            from_email: '{admin_email}',
            reply_to: '{admin_email}',
            message: '{form-fields}',
            send_confirmation_email: true,
            confirmation_email_message: 'Thanks for contacting us! We will be in touch with you shortly.'
        };

        this.default_global_settings = {
            text_message: '* Please enter text',
            number_message: '* Please enter number',
            confirm_number_message: '* Please enter only number',
            email_message: '* Please enter email address',
        };

        if (sessionStorage.getItem("ng_global_settings") === null) {
            this.global_settings = this.default_global_settings;
        } else{
            this.global_settings = JSON.parse(sessionStorage.getItem("ng_global_settings"));
        }

        //sessionStorage.setItem('ng_default_form_settings', JSON.stringify(this.default_form_settings));
    }

    private save_global_settings_updates(){
        this.load_update_global_settings_spinner = true;
        var wp = new WPAPI({
            endpoint: this.endpoint,
            nonce: this.nonce
        });
        wp.forms = wp.registerRoute('angular-forms/v1', 'update-global-settings/', {
            params: ['genre']
        });
        wp.forms().create({
            global_settings: JSON.stringify(this.global_settings)
        }).then(function (response) {
            this.load_update_global_settings_spinner = false;
        }.bind(this))
    }

    private on_global_settings_changes(global_settings: any){
        this.global_settings = global_settings;
        console.log(this.global_settings);
    }

    private save_form_updates() {
        this.load_update_form_spinner = true;
        var loaded_spinner = this.load_update_form_spinner;
        var wp = new WPAPI({
            endpoint: this.endpoint,
            nonce: this.nonce
        });
        wp.forms = wp.registerRoute('angular-forms/v1', 'update-post/', {
            params: ['genre']
        });
        wp.forms().create({
            form_id: this.form_id,
            form_title: this.form_title,
            form_fields: JSON.stringify(this.updated_form_fields),
            form_settings: JSON.stringify(this.updated_form_settings)
        }).then(function (response) {
            console.log(response);
            this.load_update_form_spinner = false;
        }.bind(this))
    }

    private on_form_title_changes(form_title:string) {
        this.form_title = form_title;
    }

    private on_edit_form_updated(form_fields:any) {
        this.updated_form_fields = form_fields;
        console.log(this.updated_form_fields);
    }

    private on_form_settings_updated(settings_data:any) {
        this.updated_form_settings = settings_data;
        console.log(this.updated_form_settings);
    }

    ngAfterViewChecked() {
        //console.log('checked');

        //if(this.component_type == 'edit') {
        //    //sessionStorage.setItem('ng_form_id', this.form_id);
        //
        //    var wp = new WPAPI({
        //        endpoint: this.endpoint,
        //        nonce: this.nonce
        //    });
        //
        //    wp.forms = wp.registerRoute( 'angular-forms/v1', 'get-post/', {
        //        params: [ 'genre' ]
        //    });
        //    wp.forms().create({
        //        form_id: this.form_id
        //    }).then(function (response) {
        //        response = JSON.parse(response);
        //
        //        this.form_setup = {
        //            form_title: response.form_title,
        //            form_type: response.form_type
        //        };
        //        this.form_fields = response.form_fields;
        //        this.settings_data = response.settings_data;
        //
        //        sessionStorage.setItem('ng_form_setup', this.form_setup);
        //        sessionStorage.setItem('ng_form_fields', this.form_fields);
        //        sessionStorage.setItem('ng_settings_data', this.settings_data);
        //
        //        this.check_data_loaded = true;
        //
        //        alert('true');
        //        console.log(this.check_data_loaded);
        //    })
        //}
    }
}