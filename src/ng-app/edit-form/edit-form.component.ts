import {Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DragulaService} from 'ng2-dragula/ng2-dragula';

@Component({
    selector: 'ng-edit-form',
    templateUrl: './edit-form.component.html'
})

export class EditFormComponent {

    private form_fields:any;
    private default_form_type:any;
    private open_field_settings_flag: boolean = false;

    public constructor(public dragulaService:DragulaService, public sanitizer:DomSanitizer) {
        const bag:any = this.dragulaService.find('drag-drop-fields');
        if (bag !== undefined)
            this.dragulaService.destroy('drag-drop-fields');
        dragulaService.setOptions("drag-drop-fields", {
            direction: "horizontal",
            revertOnSpill: true,
            moves: function (el, container, handle) {
                return true;
            },
            accepts: function (el, target, source, sibling) {
                return true;                //return defaultAccept;
            },
            copy: function (el, source) {
                //return source.classList.contains('no-drop');
            },
            copySortSource: true,
        });

        dragulaService.drag.subscribe((value) => {
            //this.onDrag(value.slice(1));
        });
        dragulaService.drop.subscribe((value) => {
            // console.log(value);
            //this.onDrop(value.slice(1));
        });
        dragulaService.over.subscribe((value) => {
            // this.onOver(value.slice(1));
            // console.log("over");
        });
        dragulaService.out.subscribe((value) => {
            // this.onOut(value.slice(1));
            // console.log("out");
        });
        dragulaService.shadow.subscribe((value) => {
            // this.onShadow(value.slice(1));
        });
        dragulaService.dragend.subscribe((value) => {
            // this.onDragend(value.slice(1));
            // console.log("out");
            // this._shadow.remove();
            // this._shadow = null;
        });

        this.default_form_type = sessionStorage.getItem('default_form_type');

        //if (this.default_form_type == 'blank') {
        //    this.generate_blank_form_fields();
        //}

        //if (this.default_form_type == 'basic') {
        this.generate_basic_form_fields();
        //}

    }

    private open_field_settings(){
        this.open_field_settings_flag = true;
    }

    private remove_field(event, object_index){
        event.target.remove();
        if (object_index > -1) {
            this.form_fields.splice(object_index, 1);
        }
    }

    private add_text_field() {
        let last_form_field = this.form_fields.length - 1;
        let text_field_object = {
            type: 'text',
            label: '-- Text Field --',
            classes: 'ng-form-field ng-text',
            required: false,
            description: '',
            placeholder: '',
            default_value: ''
            //drop_priority: 1,
        };
        if (this.form_fields[last_form_field].type == 'submit') {
            //text_field_object.drop_priority = last_form_field;
            this.form_fields.splice(last_form_field, 0, text_field_object);
        } else {
            //text_field_object.drop_priority = this.form_fields.length;
            this.form_fields.splice(this.form_fields.length, 0, text_field_object);
        }
    }

    private add_text_area_field() {
        let last_form_field = this.form_fields.length - 1;
        let text_field_object = {
            type: 'textarea',
            label: '-- Text area --',
            classes: 'ng-form-field ng-textarea',
            rows: 5,
            required: false,
            description: '',
            placeholder: '',
            default_value: ''
            //drop_priority: 1,
        };
        if (this.form_fields[last_form_field].type == 'submit') {
            //text_field_object.drop_priority = last_form_field;
            this.form_fields.splice(last_form_field, 0, text_field_object);
        } else {
            //text_field_object.drop_priority = this.form_fields.length;
            this.form_fields.splice(this.form_fields.length, 0, text_field_object);
        }
    }

    private add_email_field() {
        let last_form_field = this.form_fields.length - 1;
        let email_field_object = {
            type: 'email',
            label: '-- Email Field --',
            classes: 'ng-form-field ng-email',
            required: false,
            description: '',
            placeholder: '',
            default_value: ''
            //drop_priority: 1,
        };
        if (this.form_fields[last_form_field].type == 'submit') {
            //email_field_object.drop_priority = last_form_field;
            this.form_fields.splice(last_form_field, 0, email_field_object);
        } else {
            //email_field_object.drop_priority = this.form_fields.length;
            this.form_fields.splice(this.form_fields.length, 0, email_field_object);
        }
    }

    private add_number_field() {
        let last_form_field = this.form_fields.length - 1;
        let number_field_object = {
            type: 'number',
            label: '-- Number Field --',
            classes: 'ng-form-field ng-number',
            required: false,
            description: '',
            placeholder: '',
            default_value: ''
            //drop_priority: 1,
        };
        if (this.form_fields[last_form_field].type == 'submit') {
            //number_field_object.drop_priority = last_form_field;
            this.form_fields.splice(last_form_field, 0, number_field_object);
        } else {
            //number_field_object.drop_priority = this.form_fields.length;
            this.form_fields.splice(this.form_fields.length, 0, number_field_object);
        }
    }

    private add_radio_button() {
        let last_form_field = this.form_fields.length - 1;
        let radio_button_object = {
            type: 'radio',
            label: '-- Radio Button --',
            classes: 'ng-form-field ng-radio',
            choices: ''
            //drop_priority: 1,
        };
        if (this.form_fields[last_form_field].type == 'submit') {
            //radio_button_object.drop_priority = last_form_field;
            this.form_fields.splice(last_form_field, 0, radio_button_object);
        } else {
            //radio_button_object.drop_priority = this.form_fields.length;
            this.form_fields.splice(this.form_fields.length, 0, radio_button_object);
        }
    }

    private add_checkbox() {
        let last_form_field = this.form_fields.length - 1;
        let checkbox_object = {
            type: 'checkbox',
            label: '-- Checkbox --',
            classes: 'ng-form-field ng-checkbox',
            choices: ''
            //drop_priority: 1,
        };
        if (this.form_fields[last_form_field].type == 'submit') {
            //checkbox_object.drop_priority = last_form_field;
            this.form_fields.splice(last_form_field, 0, checkbox_object);
        } else {
            //checkbox_object.drop_priority = this.form_fields.length;
            this.form_fields.splice(this.form_fields.length, 0, checkbox_object);
        }
    }

    private add_dropdown() {
        let last_form_field = this.form_fields.length - 1;
        let dropdown_object = {
            type: 'select',
            label: '-- Select --',
            classes: 'ng-form-field ng-select',
            choices: ''
            //drop_priority: 1,
        };
        if (this.form_fields[last_form_field].type == 'submit') {
            //dropdown_object.drop_priority = last_form_field;
            this.form_fields.splice(last_form_field, 0, dropdown_object);
        } else {
            //dropdown_object.drop_priority = this.form_fields.length;
            this.form_fields.splice(this.form_fields.length, 0, dropdown_object);
        }
    }

    private generate_blank_form_fields() {
        let blank_fields = [
            {
                type: 'submit',
                label: 'Send',
                classes: 'ng-form-field ng-submit',
                position: 'left',
                //drop_priority: 1,
            }
        ]

        this.form_fields = blank_fields;
    }

    private generate_basic_form_fields() {
        let basic_fields =
            [
                {
                    type: 'text',
                    label: 'Name',
                    classes: 'ng-form-field ng-text',
                    required: false,
                    description: '',
                    placeholder: '',
                    default_value: ''
                    //drop_priority: 1,
                },
                {
                    type: 'text',
                    label: 'Title',
                    classes: 'ng-form-field ng-text',
                    required: false,
                    description: '',
                    placeholder: '',
                    default_value: ''
                    //drop_priority: 2,
                },
                {
                    type: 'textarea',
                    label: 'Description',
                    classes: 'ng-form-field ng-textarea',
                    rows: 5,
                    required: false,
                    description: '',
                    placeholder: '',
                    default_value: ''
                    //drop_priority: 3,
                },
                {
                    type: 'submit',
                    label: 'Send',
                    classes: 'ng-form-field ng-submit',
                    position: 'left'
                    //drop_priority: 4,
                }
            ]

        this.form_fields = basic_fields;
    }

    //private generate_form_field_html(form_field_object) {
    //    let label = '';
    //    let field = '';
    //
    //    let field_array_object = form_field_object;
    //    let field_type = field_array_object.type;
    //
    //    switch (field_type) {
    //        case 'text':
    //            label = '<label>'+field_array_object.label + '</label></br>';
    //            field = '<input disabled type="text" class="' + field_array_object.classes + '" />';
    //            break;
    //        case 'textarea':
    //            label = '<label>'+field_array_object.label + '</label></br>';
    //            field = '<textarea disabled class="' + field_array_object.classes + '" rows="2"></textarea>';
    //            break;
    //        case 'email':
    //            label = '<label>'+field_array_object.label + '</label></br>';
    //            field = '<input disabled type="email" class="' + field_array_object.classes + '" />';
    //            break;
    //        case 'number':
    //            label = '<label>'+field_array_object.label + '</label></br>';
    //            field = '<input disabled type="number" class="' + field_array_object.classes + '" />';
    //            break;
    //        case 'submit':
    //            field = '<input disabled type="submit" class="' + field_array_object.classes + '" />';
    //            break;
    //        case 'radio':
    //            label = '<label>'+field_array_object.label + '</label></br>';
    //            field = '<input disabled type="radio" class="' + field_array_object.classes + '" value="radio">Radio<br>'
    //            break;
    //        case 'checkbox':
    //            label = '<label>'+field_array_object.label + '</label></br>';
    //            field = '<input type="checkbox" value="checkbox"> Checkbox<br>';
    //            break;
    //        case 'select':
    //            label = '<label>'+field_array_object.label + '</label></br>';
    //            field = '<select><option value="option1">Option1</option></select>';
    //            break;
    //    }
    //    let final_html = label.concat(field);
    //
    //    return this.sanitizer.bypassSecurityTrustHtml(final_html);
    //}

    private onDrag(args) {
        let [e, el] = args;
        // do something
    }

    private onDrop(args) {
        let [e, el] = args;
        // do something
    }

    private onOver(args) {
        let [e, el, container] = args;
        // do something
    }

    private onOut(args) {
        let [e, el, container] = args;
        // do something
    }
}