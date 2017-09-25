import {Component, EventEmitter, Output, ViewChild, ViewRef, Input, Inject} from '@angular/core';
import { AddFormDirective } from '../../add-form/add-form.directives';

import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'ang-checkbox',
    templateUrl: './checkbox.component.html'
})

export class CheckboxViewComponent {

    // @ViewChild(AddFormDirective) addFormDirective: AddFormDirective;

    @Input() componentViewRef: any;
    @Input() viewContainerRef: any;
    @Input() public dialog: MdDialog;

    // animal: string;
    // name: string;

    data_options: any;

    // @Output()
    // remove : EventEmitter<any> = new EventEmitter();

    constructor(){
        this.data_options = [
            {"required_field": {required: 0, placeholder: 'Please enter required field text', value: ''}},
            {"label": {placeholder: 'Please enter a label',value: ''}},
            {"radio_options": [{placeholder: 'Type an option', value: '', delete: 0}]},
            {"id_attribute": {placeholder: 'Please enter an Id', value: ''}},
            {"class_attributes": {placeholder: 'Please enter classes', value: ''}},
        ]
    }

    remove_element(){
        // this.remove.emit();
        // let viewContainerRef = this.addFormDirective.viewContainerRef;
        // console.log(viewContainerRef);
        // console.log(this.viewContainerRef);
        // console.log(this.componentViewRef);
        let currentComponentIndex = this.viewContainerRef.indexOf(this.componentViewRef);
        // console.log(currentComponentIndex);
        this.viewContainerRef.remove(currentComponentIndex);
    }

    open_settings_dialog(){
        let dialogRef = this.dialog.open(CheckboxSettingsDialog, {
            width: '450px',
            data: this.data_options
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if(result !== undefined)
            this.data_options = result;
        });
    }
}

@Component({
    selector: 'checkbox-settings-dialog',
    templateUrl: 'checkbox-settings-dialog.html',
})
export class CheckboxSettingsDialog {

    constructor(
        public dialogRef: MdDialogRef<CheckboxSettingsDialog>,
        @Inject(MD_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    add_new_option(){
        this.data[2]['radio_options'].push({placeholder: 'Type an option', delete: 1});
    }

    delete_current_option(event, data_option){
        let currentArrayIndex = this.data[2]['radio_options'].indexOf(data_option);
        this.data[2]['radio_options'].splice(currentArrayIndex, 1);
        event.target.parentNode.remove();
    }

}