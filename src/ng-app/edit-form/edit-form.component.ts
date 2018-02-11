import {Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DragulaService} from 'ng2-dragula/ng2-dragula';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

@Component({
    selector: 'ng-edit-form',
    templateUrl: './edit-form.component.html'
})

export class EditFormComponent {

    private form_fields:any;
    private default_form_type:any;
    private open_field_settings_flag: boolean = false;
    private choices_values: any;
    private active_field_object: any;
    private style_cursor: string;

    private visible: boolean = true;
    private selectable: boolean = true;
    private removable: boolean = true;
    private addOnBlur: boolean = true;

    private separatorKeysCodes = [ENTER, COMMA];

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

        this.style_cursor = 'pointer';

    }

    private remove_a_choice(event, choice_name){
        let choices_string = this.active_field_object.choices;
        let choices_array = choices_string.split('<>');
        var index = choices_array.indexOf(choice_name);
        if (index > -1) {
            choices_array.splice(index, 1);
        }
        choices_string = choices_array.join('<>');
        this.active_field_object.choices = choices_string;
    }

    private add_new_choice(event, active_object){
        let choice_name = event.target.value;
        let choices_string = active_object.choices;
        let choices_array = choices_string.split('<>');
        choices_array.push(choice_name);
        choices_string = choices_array.join('<>');
        active_object.choices = choices_string;

        this.active_field_object = active_object;

        event.target.value = '';
    }

    private get_checkbox_selected_choices_array(checkbox_selected_choices){
        let choice_array = checkbox_selected_choices.split(',');
        return choice_array;
    }

    private in_array(needle, haystack) {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            if (typeof haystack[i] == 'object') {
                if (this.arrayCompare(haystack[i], needle)) return true;
            } else {
                if (haystack[i] == needle) return true;
            }
        }
        return false;
    }

    private arrayCompare(a1, a2) {
        if (a1.length != a2.length) return false;
        var length = a2.length;
        for (var i = 0; i < length; i++) {
            if (a1[i] !== a2[i]) return false;
        }
        return true;
    }

    private get_choices_array(choice_string){
        let choice_array = choice_string.split('<>');
        return choice_array;
    }

    private open_field_settings(field){
        this.open_field_settings_flag = true;
        this.active_field_object = field;
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
            hide_label: false,
            classes: 'ng-form-field ng-text',
            required: false,
            description: '',
            placeholder: '',
            hide_placeholder: false,
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
            hide_label: false,
            classes: 'ng-form-field ng-textarea',
            rows: 5,
            required: false,
            description: '',
            placeholder: '',
            hide_placeholder: false,
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
            hide_label: false,
            classes: 'ng-form-field ng-email',
            required: false,
            description: '',
            placeholder: '',
            hide_placeholder: false,
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
            hide_label: false,
            classes: 'ng-form-field ng-number',
            required: false,
            description: '',
            placeholder: '',
            hide_placeholder: false,
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
            hide_label: false,
            required: false,
            classes: 'ng-form-field ng-radio',
            choices: 'Choice 1<>Choice 2<>Choice 3',
            description: '',
            choice_selected: -1
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
            hide_label: false,
            required: false,
            classes: 'ng-form-field ng-checkbox',
            choices: 'Choice 1<>Choice 2<>Choice 3',
            description: '',
            choice_selected: '-1'
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
            hide_label: false,
            required: false,
            classes: 'ng-form-field ng-select',
            choices: 'Choice 1<>Choice 2<>Choice 3',
            description: '',
            choice_selected: -1
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
                    hide_label: false,
                    classes: 'ng-form-field ng-text',
                    required: false,
                    description: '',
                    placeholder: '',
                    hide_placeholder: false,
                    default_value: ''
                    //drop_priority: 1,
                },
                {
                    type: 'text',
                    label: 'Title',
                    hide_label: false,
                    classes: 'ng-form-field ng-text',
                    required: false,
                    description: '',
                    placeholder: '',
                    hide_placeholder: false,
                    default_value: ''
                    //drop_priority: 2,
                },
                {
                    type: 'textarea',
                    label: 'Description',
                    hide_label: false,
                    classes: 'ng-form-field ng-textarea',
                    rows: 5,
                    required: false,
                    description: '',
                    placeholder: '',
                    hide_placeholder: false,
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