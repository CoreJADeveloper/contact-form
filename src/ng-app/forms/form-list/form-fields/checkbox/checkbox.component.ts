import { Component } from '@angular/core';

@Component({
    selector: 'ang-checkbox',
    templateUrl: './checkbox.component.html'
})

export class CheckboxViewComponent {

    constructor(){
    }

    remove_element(event){
        event.stopPropagation();
        console.log(event);
    }
}