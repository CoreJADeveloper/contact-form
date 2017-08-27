import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'form-list',
    templateUrl: './form-list.component.html'
})

export class FormListViewComponent implements OnInit {
    public view_form_list_container: boolean;

    constructor(){

    }

    ngOnInit(): void {
        this.view_form_list_container = true;
    }

    toggle_to_add_new(): void {
        this.view_form_list_container = false;
    }

    toggle_to_form_list(): void {
        this.view_form_list_container = true;
    }
}