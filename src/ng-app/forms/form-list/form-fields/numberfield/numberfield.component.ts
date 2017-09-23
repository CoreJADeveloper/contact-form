import { Component, Input } from '@angular/core';

@Component({
    selector: 'ang-numberfield',
    templateUrl: './numberfield.component.html'
})

export class NumberFieldViewComponent {

    @Input() componentViewRef: any;
    @Input() viewContainerRef: any;

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