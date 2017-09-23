import { Component, EventEmitter, Output, ViewChild, ViewRef, Input } from '@angular/core';
import { AddFormDirective } from '../../add-form/add-form.directives';

@Component({
    selector: 'ang-checkbox',
    templateUrl: './checkbox.component.html'
})

export class CheckboxViewComponent {

    // @ViewChild(AddFormDirective) addFormDirective: AddFormDirective;

    @Input() componentViewRef: any;
    @Input() viewContainerRef: any;

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
}