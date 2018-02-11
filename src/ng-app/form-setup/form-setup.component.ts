import { Component, OnInit } from '@angular/core';

import {FormObject} from './form';

export var WPAPI = require('wpapi');

@Component({
    selector: 'ng-form-setup',
    templateUrl: './form-setup.component.html'
})

export class FormSetupComponent implements OnInit {

    private form_types:any;
    private submitted = false;
    private form_name:string = '';
    private form_type:string = '';

    private site_endpoint:any;
    private site_nonce:any;

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

        this.site_endpoint = sessionStorage.getItem('site_endpoint');
        this.site_nonce = sessionStorage.getItem('site_nonce');
    }

    ngOnInit() {

    }

    onSubmit(form:any) {
        this.submitted = true;

        this.form_name = form.form_name;

        var wp = new WPAPI({
            endpoint: this.site_endpoint,
            nonce: this.site_nonce
        });
        //wp.types().type('angular-forms');
        wp.forms = wp.registerRoute( 'angular-forms/v1', 'create-post/', {
            params: [ 'genre' ]
        });
        wp.forms().create({
            title: this.form_name,
            content: '',
            status: 'publish',
            meta: {
                default_form_type: this.form_type
            }
        }).then(function (response) {
            window.location.href = response;
        })
    }

    onClick(form_id) {
        this.form_type = form_id;
    }
}