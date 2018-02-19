import {Component, Output, EventEmitter} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DragulaService} from 'ng2-dragula/ng2-dragula';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

@Component({
    selector: 'ng-edit-form',
    templateUrl: './edit-form.component.html'
})

export class EditFormComponent {

    @Output() onFormInputChange = new EventEmitter<any>();

    private form_fields:any;
    private default_form_type:any;
    private open_field_settings_flag:boolean = false;
    private choices_values:any;
    private active_field_object:any;
    private style_cursor:string;
    private required_text_color:any;

    private visible:boolean = true;
    private selectable:boolean = true;
    private removable:boolean = true;
    private addOnBlur:boolean = true;

    private separatorKeysCodes = [ENTER, COMMA];

    private make_field_close_hidden:boolean = true;

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
            this.onFormInputChange.emit(this.form_fields);
            //this.onDrag(value.slice(1));
        });
        dragulaService.drop.subscribe((value) => {
            this.onFormInputChange.emit(this.form_fields);
            // console.log(value);
            //this.onDrop(value.slice(1));
        });
        dragulaService.over.subscribe((value) => {
            this.onFormInputChange.emit(this.form_fields);
            // this.onOver(value.slice(1));
            // console.log("over");
        });
        dragulaService.out.subscribe((value) => {
            this.onFormInputChange.emit(this.form_fields);
            // this.onOut(value.slice(1));
            // console.log("out");
        });
        dragulaService.shadow.subscribe((value) => {
            this.onFormInputChange.emit(this.form_fields);
            // this.onShadow(value.slice(1));
        });
        dragulaService.dragend.subscribe((value) => {
            this.onFormInputChange.emit(this.form_fields);
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
        //this.generate_basic_form_fields();
        //}

        this.form_fields = JSON.parse(sessionStorage.getItem('ng_form_fields'));

        this.style_cursor = 'pointer';
        this.required_text_color = '#FF0000';
    }

    private on_hover_over_field(event) {
        let element = event.target;
        element.className += ' on-mouse-over-form-field';
        element.getElementsByClassName('close-form-field')[0].style.display = 'inline-block';
    }

    private on_leave_hover_over_field(event) {
        let element = event.target;
        element.classList.remove('on-mouse-over-form-field');
        element.getElementsByClassName('close-form-field')[0].style.display = 'none';
    }

    private onFormValueUpdated(event) {
        this.onFormInputChange.emit(this.form_fields);
    }

    private update_submit_position(event, index) {
        if (event.source.checked) {
            this.active_field_object.position_checked = index;
        }
        this.onFormInputChange.emit(this.form_fields);
    }

    get fieldClasses() {
        return this.active_field_object.classes;
    }

    set fieldClasses(v) {
        this.active_field_object.classes = v;
        this.onFormInputChange.emit(this.form_fields);
    }

    get fieldDefaultValue() {
        return this.active_field_object.default_value;
    }

    set fieldDefaultValue(v) {
        this.active_field_object.default_value = v;
        this.onFormInputChange.emit(this.form_fields);
    }

    get fieldDescription() {
        return this.active_field_object.description;
    }

    set fieldDescription(v) {
        this.active_field_object.description = v;
        this.onFormInputChange.emit(this.form_fields);
    }

    private update_hide_label(event) {
        if (event.checked) {
            this.active_field_object.hide_label = true;
        } else {
            this.active_field_object.hide_label = false;
        }
        this.onFormInputChange.emit(this.form_fields);
    }

    private update_required_field(event) {
        if (event.checked) {
            this.active_field_object.required = true;
        } else {
            this.active_field_object.required = false;
        }
        this.onFormInputChange.emit(this.form_fields);
    }

    private add_new_choice(event) {
        let new_choice = event.target.value;
        let choices_array = this.active_field_object.choices;
        let choice_object = {
            text: new_choice,
        };
        choices_array.push(choice_object);

        event.target.value = '';

        this.onFormInputChange.emit(this.form_fields);
    }

    private update_choice_selected(event, index) {
        if (event.source.checked) {
            this.active_field_object.choice_selected = index;
        } else {
            this.active_field_object.choice_selected = -1;
        }
        this.onFormInputChange.emit(this.form_fields);
    }

    private remove_a_checkbox_choice(active_array, index) {
        active_array.splice(index, 1);
        this.onFormInputChange.emit(this.form_fields);
    }

    //private is_checkbox_choice_checked(index) {
    //    let choices_selected_array = this.get_checkbox_choices_selected_array(this.active_field_object);
    //
    //    return this.check_if_choice_selected(index, choices_selected_array);
    //}

    //private check_if_choice_selected(index, choices_selected_array) {
    //    if (typeof choices_selected_array != undefined || choices_selected_array != null) {
    //        for (let i = 0; i < choices_selected_array.length; i++) {
    //            if (choices_selected_array[i] != -1 && choices_selected_array[i] == index) {
    //                return true;
    //            }
    //        }
    //    }
    //    return false;
    //}

    //private get_checkbox_choices_selected_array(active_object) {
    //    let choice_selected_array;
    //    if (active_object.choice_selected != -1)
    //        choice_selected_array = active_object.choice_selected.split(',').map(Number);
    //    else
    //        choice_selected_array = new Array();
    //    //console.log(choice_selected_array);
    //    choice_selected_array = Array.from(new Set(choice_selected_array));
    //    return choice_selected_array;
    //}

    private update_checkbox_choice_selected(event, index) {
        let choice_selected = event.checked;
        this.active_field_object.choices[index].checked = choice_selected;
        //console.log(event);
        //let choices_selected_array = this.get_checkbox_choices_selected_array(this.active_field_object);

        //if (choice_selected) {
        //choices_selected_array.push(index);
        //choices_string = choices_selected_array.join(',');
        //this.active_field_object.choice_selected = choices_string;
        //active_choice_object.checked = true;
        //} else {
        //choices_selected_array.splice(index, 1);
        //console.log(choices_selected_array);
        //if (choices_selected_array.length > 0) {
        //    choices_string = choices_selected_array.join(',');
        //    this.active_field_object.choice_selected = choices_string;
        //} else {
        //    this.active_field_object.choice_selected = -1;
        //}
        //active_choice_object.checked = false;
        //}

        this.onFormInputChange.emit(this.form_fields);
    }

    private track_by_Index(index:any, item:any) {
        return index;
    }

    private update_choice_text(event, index, choices_array) {
        let new_choice_text = event.target.value;

        choices_array[index] = new_choice_text;

        let choices_string = choices_array.join('<>');
        this.active_field_object.choices = choices_string;

        this.onFormInputChange.emit(this.form_fields);
        //event.target.focus();
    }

    private remove_a_choice(index) {
        let choices_array = this.active_field_object.choices;
        if (index > -1) {
            choices_array.splice(index, 1);
        }
        if (this.active_field_object.choice_selected == index) {
            this.active_field_object.choice_selected = -1;
        }

        this.onFormInputChange.emit(this.form_fields);
    }

    private add_new_checkbox_choice(event, choices) {
        let choice_name = event.target.value;
        //let choices_array = active_object.choices;
        //let choices_array = choices_string.split('<>');
        let choice = {
            text: choice_name,
            checked: false
        };
        choices.push(choice);
        //choices_string = choices_array.join('<>');
        //active_object.choices = choices_string;

        //this.active_field_object = active_object;

        event.target.value = '';

        this.onFormInputChange.emit(this.form_fields);
    }

    //private get_checkbox_selected_choices_array(checkbox_selected_choices) {
    //    let choice_array = checkbox_selected_choices.split(',');
    //    return choice_array;
    //}

    private in_array(needle, haystack) {
        var length = haystack.length;
        //console.log(needle);
        //console.log(haystack);
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

    //private get_choices_array(choice_string) {
    //    let choice_array = choice_string.split('<>');
    //    return choice_array;
    //}

    private open_field_settings(index, field) {
        this.open_field_settings_flag = true;
        this.active_field_object = field;

        let list_items = document.getElementsByClassName('mat-list-ng-each-field');
        for (let i = 0; i < list_items.length; i++) {
            if (list_items[i].classList.contains('active-form-field-identify')) {
                list_items[i].classList.remove('active-form-field-identify');
            }
        }

        list_items[index].className += ' active-form-field-identify';
    }

    private remove_field(event, object_index) {
        event.target.remove();
        if (object_index > -1) {
            this.form_fields.splice(object_index, 1);
        }
        this.onFormInputChange.emit(this.form_fields);
    }

    private add_text_field() {
        let last_form_field = this.form_fields.length - 1;
        let text_field_object = {
            type: 'text',
            label: '-- Text Field --',
            hide_label: false,
            built_classes: 'ng-form-field ng-text',
            classes: '',
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
        this.onFormInputChange.emit(this.form_fields);
    }

    private add_text_area_field() {
        let last_form_field = this.form_fields.length - 1;
        let text_field_object = {
            type: 'textarea',
            label: '-- Text area --',
            hide_label: false,
            built_classes: 'ng-form-field ng-textarea',
            classes: '',
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
        this.onFormInputChange.emit(this.form_fields);
    }

    private add_email_field() {
        let last_form_field = this.form_fields.length - 1;
        let email_field_object = {
            type: 'email',
            label: '-- Email Field --',
            hide_label: false,
            built_classes: 'ng-form-field ng-email',
            classes: '',
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
        this.onFormInputChange.emit(this.form_fields);
    }

    private add_number_field() {
        let last_form_field = this.form_fields.length - 1;
        let number_field_object = {
            type: 'number',
            label: '-- Number Field --',
            hide_label: false,
            built_classes: 'ng-form-field ng-number',
            classes: '',
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
        this.onFormInputChange.emit(this.form_fields);
    }

    private add_radio_button() {
        let last_form_field = this.form_fields.length - 1;
        let radio_button_object = {
            type: 'radio',
            label: '-- Radio Button --',
            hide_label: false,
            required: false,
            built_classes: 'ng-form-field ng-radio',
            classes: '',
            choices: [{text: 'Choice 1'}, {text: 'Choice 2'}, {text: 'Choice 3'}],
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
        this.onFormInputChange.emit(this.form_fields);
    }

    private add_checkbox() {
        let last_form_field = this.form_fields.length - 1;
        let checkbox_object = {
            type: 'checkbox',
            label: '-- Checkbox --',
            hide_label: false,
            required: false,
            built_classes: 'ng-form-field ng-checkbox',
            classes: '',
            choices: [
                {
                    text: 'Choice 1',
                    checked: false,
                },
                {
                    text: 'Choice 2',
                    checked: false,
                },
                {
                    text: 'Choice 3',
                    checked: false,
                }
            ],
            description: '',
            choice_selected: -1
            //drop_priority: 1,
        };
        if (this.form_fields[last_form_field].type == 'submit') {
            //checkbox_object.drop_priority = last_form_field;
            this.form_fields.splice(last_form_field, 0, checkbox_object);
        } else {
            //checkbox_object.drop_priority = this.form_fields.length;
            this.form_fields.splice(this.form_fields.length, 0, checkbox_object);
        }
        this.onFormInputChange.emit(this.form_fields);
    }

    private add_dropdown() {
        let last_form_field = this.form_fields.length - 1;
        let dropdown_object = {
            type: 'select',
            label: '-- Select --',
            hide_label: false,
            required: false,
            built_classes: 'ng-form-field ng-select',
            classes: '',
            choices: [{text: 'Choice 1'}, {text: 'Choice 2'}, {text: 'Choice 3'}],
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
        this.onFormInputChange.emit(this.form_fields);
    }

    private generate_blank_form_fields() {
        let blank_fields = [
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
                //drop_priority: 1,
            }
        ]

        this.form_fields = blank_fields;

        this.onFormInputChange.emit(this.form_fields);
    }

    private generate_basic_form_fields() {
        let basic_fields =
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
                    default_value: ''
                    //drop_priority: 1,
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
                    default_value: ''
                    //drop_priority: 2,
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
                    default_value: ''
                    //drop_priority: 3,
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
                    //drop_priority: 4,
                }
            ]

        this.form_fields = basic_fields;

        this.onFormInputChange.emit(this.form_fields);
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