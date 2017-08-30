import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'add-form',
    templateUrl: './add-form.component.html'
})

export class AddFormViewComponent implements OnInit {

    constructor() {

    }

    ngOnInit(): void {
    }

    // dragstart_handler(event: any): void {
    //     console.log("dragStart");
    //     // Add the target element's id to the data transfer object
    //     event.dataTransfer.setData("text/plain", event.target.id);
    // }


}