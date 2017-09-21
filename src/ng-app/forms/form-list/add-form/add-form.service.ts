import { Injectable, Inject, ComponentFactoryResolver, Input } from '@angular/core';

import {TextFieldViewComponent} from "../form-fields/textfield/textfield.component";
import { TextAreaViewComponent } from '../form-fields/textarea/textarea.component';
import { CheckboxViewComponent } from '../form-fields/checkbox/checkbox.component';
import { RadioButtonViewComponent } from '../form-fields/radiobutton/radiobutton.component';
import { EmailFieldViewComponent } from '../form-fields/emailfield/emailfield.component';
import { NumberFieldViewComponent } from '../form-fields/numberfield/numberfield.component';

@Injectable()
export class AddFormService{
    factoryResolver: ComponentFactoryResolver;

    @Input() innerHTML: string;

    constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
        this.factoryResolver = factoryResolver;
    }

    addDynamicComponent(viewContainerRef, draggedElement) {
        // let componentFactory = this.factoryResolver.resolveComponentFactory(TextFieldViewComponent);
        // let componentRef = viewContainerRef.createComponent(componentFactory);
        // console.log(componentRef);
        // draggedElement.replaceWith(viewContainerRef.insert(componentRef.hostView));
        // viewContainerRef.clear();

        let draggedElementId = draggedElement.id;
        let factory;
        switch(draggedElementId) {
            case "textfield-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(TextFieldViewComponent);
                break;
            case "emailfield-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(EmailFieldViewComponent);
                break;
            case "numberfield-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(NumberFieldViewComponent);
                break;
            case "checkbox-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(CheckboxViewComponent);
                break;
            case "radiobutton-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(RadioButtonViewComponent);
                break;
            case "textarea-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(TextAreaViewComponent);
                break;
        }

        console.log(factory);

        let component = factory
            .create(viewContainerRef.parentInjector);
        viewContainerRef.insert(component.hostView);
        // draggedElement.replaceWith(list_item);
        // viewContainerRef.clear();
        draggedElement.remove();
    }
}


// get html from dom container