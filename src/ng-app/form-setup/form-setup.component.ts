import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

export var WPAPI = require('wpapi');

@Component({
    selector: 'ng-form-setup',
    templateUrl: './form-setup.component.html'
})

export class FormSetupComponent implements OnInit {
    @Input() default_blank_fields;
    @Input() default_basic_fields;
    @Input() default_form_settings;
    @Input() default_form_action;

    @Input()
    set endpoint(endpoint: string) {
        this.site_endpoint = endpoint;
    }

    get endpoint(): string { return this.site_endpoint; }

    @Input()
    set nonce(nonce_name: string) {
        this.site_nonce = nonce_name;
    }

    get nonce(): string { return this.site_nonce; }

    //set default_form_action(form_action: string) {
    //    this.form_action_type = form_action;
    //}
    //
    //get default_form_action(): string { return this.form_action_type; }

    @Output() onFormTitleChanges = new EventEmitter<string>();

    private form_types:any;
    private submitted = false;
    private form_name:string = '';
    private form_type:string = '';

    private site_endpoint:any;
    private site_nonce:any;

    private form_fields:any;
    private basic_fields:any;
    private blank_fields:any;
    private settings_data:any;

    private form_action_type:any;

    private form_setup_object:any;
    private empty_field:boolean = false;

    private form_action_mode:string;

    private edit_form_title:string;
    private edit_form_type:string;
    private active_edit_form_color:string = '#3f51b5';

    private fields:any;

    public constructor() {
        this.form_types = [
            {
                text: 'This is a blank form. You can add, edit and delete any field later.',
                id: 'blank',
                cols: 2,
                rows: 1,
                color: '#FFFFFF'
            },
            {
                text: 'This is a basic form. You can add, edit and delete any field later.',
                id: 'basic',
                cols: 2,
                rows: 1,
                color: '#FFFFFF'
            },
        ];
        //this.form_action_type = sessionStorage.getItem('ng_default_form_action');

        //console.log(this.form_action_type);


        //this.basic_fields =
        //    [
        //        {
        //            type: 'text',
        //            label: 'Name',
        //            hide_label: false,
        //            built_classes: 'ng-form-field ng-text',
        //            classes: '',
        //            required: false,
        //            description: '',
        //            placeholder: '',
        //            default_value: '',
        //        },
        //        {
        //            type: 'text',
        //            label: 'Title',
        //            hide_label: false,
        //            built_classes: 'ng-form-field ng-text',
        //            classes: '',
        //            required: false,
        //            description: '',
        //            placeholder: '',
        //            default_value: '',
        //        },
        //        {
        //            type: 'textarea',
        //            label: 'Description',
        //            hide_label: false,
        //            built_classes: 'ng-form-field ng-textarea',
        //            classes: '',
        //            rows: 5,
        //            required: false,
        //            description: '',
        //            placeholder: '',
        //            default_value: '',
        //        },
        //        {
        //            type: 'submit',
        //            label: 'Send',
        //            built_classes: 'ng-form-field ng-submit',
        //            classes: '',
        //            position: [
        //                {
        //                    text: 'left',
        //                },
        //                {
        //                    text: 'right',
        //
        //                }
        //            ],
        //            position_checked: 0,
        //        }
        //    ];
        //this.blank_fields = [
        //    {
        //        type: 'submit',
        //        label: 'Send',
        //        built_classes: 'ng-form-field ng-submit',
        //        classes: '',
        //        position: [
        //            {
        //                text: 'left',
        //            },
        //            {
        //                text: 'right',
        //
        //            }
        //        ],
        //        position_checked: 0,
        //    }
        //];

        //this.site_endpoint = sessionStorage.getItem('ng_site_endpoint');
        //this.site_nonce = sessionStorage.getItem('ng_site_nonce');

        //this.settings_data = {
        //    form_name: '',
        //    form_css_classes: '',
        //    submit_button_processing_text: 'Please wait...',
        //    anti_span_honeybot: false,
        //    send_to_email: '{admin_email}',
        //    email_subject: '',
        //    from_name: '',
        //    from_email: '{admin_email}',
        //    reply_to: '',
        //    message: '{form-fields}',
        //    send_confirmation_email: true,
        //    confirmation_email_message: 'Thanks for contacting us! We will be in touch with you shortly.'
        //};
    }

    private check_title_check(event) {
        if (event.length <= 1) {
            this.empty_field = true;
        } else{
            this.empty_field = false;
        }

        this.edit_form_title = event;

        this.onFormTitleChanges.emit(this.edit_form_title);
    }

    ngOnInit() {
        this.basic_fields = this.default_basic_fields;
        this.blank_fields = this.default_blank_fields;
        this.settings_data = this.default_form_settings;
        console.log(this.settings_data);
        this.form_action_type = this.default_form_action;

        if (this.form_action_type == 'edit') {
            this.form_action_mode = 'edit';
            this.edit_form_title = sessionStorage.getItem('ng_form_title');
            console.log(this.edit_form_title);
            this.edit_form_type = sessionStorage.getItem('ng_form_type');
        } else {
            this.form_action_mode = 'add';

        }
    }

    onSubmit(form:any) {
        this.submitted = true;

        this.form_name = form.form_name;

        var wp = new WPAPI({
            endpoint: this.site_endpoint,
            nonce: this.site_nonce
        });

        if (this.form_type == 'blank') {
            this.form_fields = this.blank_fields;
        }

        if (this.form_type == 'basic') {
            this.form_fields = this.basic_fields;
        }

        //wp.types().type('angular-forms');
        wp.forms = wp.registerRoute('angular-forms/v1', 'create-post/', {
            params: ['genre']
        });
        wp.forms().create({
            title: this.form_name,
            content: '',
            status: 'publish',
            meta: {
                default_form_type: this.form_type,
                form_fields: JSON.stringify(this.form_fields),
                settings_data: JSON.stringify(this.settings_data)
            }
        }).then(function (response) {
            window.location.href = response;
        })
    }

    onClick(form_id) {
        this.form_type = form_id;
    }
}