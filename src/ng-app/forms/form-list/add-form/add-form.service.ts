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
        let component;
        let componentRef;
        switch(draggedElementId) {
            case "textfield-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(TextFieldViewComponent);
                // component = factory
                //     .create(viewContainerRef.parentInjector);
                componentRef = viewContainerRef.createComponent(factory);
                (<TextFieldViewComponent>componentRef.instance).componentViewRef = componentRef.hostView;
                (<TextFieldViewComponent>componentRef.instance).viewContainerRef = viewContainerRef;
                break;
            case "emailfield-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(EmailFieldViewComponent);
                // component = factory
                //     .create(viewContainerRef.parentInjector);
                componentRef = viewContainerRef.createComponent(factory);
                (<EmailFieldViewComponent>componentRef.instance).componentViewRef = componentRef.hostView;
                (<EmailFieldViewComponent>componentRef.instance).viewContainerRef = viewContainerRef;
                break;
            case "numberfield-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(NumberFieldViewComponent);
                // component = factory
                //     .create(viewContainerRef.parentInjector);
                componentRef = viewContainerRef.createComponent(factory);
                (<NumberFieldViewComponent>componentRef.instance).componentViewRef = componentRef.hostView;
                (<NumberFieldViewComponent>componentRef.instance).viewContainerRef = viewContainerRef;
                break;
            case "checkbox-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(CheckboxViewComponent);
                // component = factory
                //     .create(viewContainerRef.parentInjector);
                componentRef = viewContainerRef.createComponent(factory);
                (<CheckboxViewComponent>componentRef.instance).componentViewRef = componentRef.hostView;
                (<CheckboxViewComponent>componentRef.instance).viewContainerRef = viewContainerRef;
                break;
            case "radiobutton-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(RadioButtonViewComponent);
                componentRef = viewContainerRef.createComponent(factory);
                (<RadioButtonViewComponent>componentRef.instance).componentViewRef = componentRef.hostView;
                (<RadioButtonViewComponent>componentRef.instance).viewContainerRef = viewContainerRef;
                break;
            case "textarea-dragged":
                factory = this.factoryResolver
                    .resolveComponentFactory(TextAreaViewComponent);
                componentRef = viewContainerRef.createComponent(factory);
                (<TextAreaViewComponent>componentRef.instance).componentViewRef = componentRef.hostView;
                (<TextAreaViewComponent>componentRef.instance).viewContainerRef = viewContainerRef;
                break;
        }

        // console.log(factory);
        // viewContainerRef.insert(component.hostView);
        // draggedElement.replaceWith(list_item);
        // viewContainerRef.clear();
        // (<AdComponent>componentRef.instance).data = adItem.data;
        draggedElement.remove();
    }

    // getSelectedComponent(){
    //     return this.selectedComponent;
    // }
}


// get html from dom container