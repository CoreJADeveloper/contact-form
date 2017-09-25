import { Component, Input, Inject } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from "@angular/material";

@Component({
    selector: 'ang-textarea',
    templateUrl: './textarea.component.html'
})

export class TextAreaViewComponent {

    @Input() componentViewRef: any;
    @Input() viewContainerRef: any;
    @Input() public dialog: MdDialog;

    data_options: any;

    constructor(){
        this.data_options = [
            {"required_field": {required: 0, placeholder: 'Please enter required field text', value: ''}},
            {"label": {placeholder: 'Please enter a label',value: ''}},
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
        let dialogRef = this.dialog.open(TextareaSettingsDialog, {
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
    selector: 'textarea-settings-dialog',
    templateUrl: 'textarea-settings-dialog.html',
})
export class TextareaSettingsDialog {

    constructor(
        public dialogRef: MdDialogRef<TextareaSettingsDialog>,
        @Inject(MD_DIALOG_DATA) public data: any) { }

    onNoClick(){
        this.dialogRef.close();
        return false;
    }
}