import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[add-form-element]'
})

export class AddFormDirective{
    constructor(public viewContainerRef: ViewContainerRef){}
}