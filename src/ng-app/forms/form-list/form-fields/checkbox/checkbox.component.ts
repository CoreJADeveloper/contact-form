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

    animal: string;
    name: string;

    // @Output()
    // remove : EventEmitter<any> = new EventEmitter();

    constructor(){
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
            data: [
                {"radio_options": [{placeholder: 'Type an option', delete: 0}]},
            ]
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
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
        this.data[0]['radio_options'].push({placeholder: 'Type an option', delete: 1});
    }

    delete_current_option(event){
        event.target.parentNode.remove();
    }

}