import {Component, Inject, Input} from '@angular/core';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from "@angular/material";

@Component({
    selector: 'ang-numberfield',
    templateUrl: './numberfield.component.html'
})

export class NumberFieldViewComponent {

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
        let dialogRef = this.dialog.open(NumberfieldSettingsDialog, {
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
    selector: 'numberfield-settings-dialog',
    templateUrl: 'numberfield-settings-dialog.html',
})
export class NumberfieldSettingsDialog {

    constructor(
        public dialogRef: MdDialogRef<NumberfieldSettingsDialog>,
        @Inject(MD_DIALOG_DATA) public data: any) { }

    onNoClick(){
        this.dialogRef.close();
        return false;
    }
}