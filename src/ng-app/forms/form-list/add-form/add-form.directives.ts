import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[dragTextField]' })
export class DragTextFieldDirective {

    public textFieldFlag: true;

    constructor(private el: ElementRef) { }

    @HostListener('dragstart', ['$event']) ondragstart(event) {
        this.dragstart_handler(event);
    }

    private dragstart_handler(event) {
        let textfield_dom = document.getElementById("form-textfield").innerHTML;
        event.dataTransfer.setData("text", textfield_dom);
        event.dataTransfer.setData("text/plain", textfield_dom);
        event.dataTransfer.setData("text/html", textfield_dom);
        event.dataTransfer.setData("text/uri-list", textfield_dom);
        event.dropEffect = "copy";
    }
}

@Directive({ selector: '[dropFields]' })
export class DropFieldsDirective {

    constructor(private el: ElementRef) { }

    @HostListener('drop', ['$event']) ondrop(event) {
        event.preventDefault();
        this.drop_handler(event);
    }

    @HostListener('dragover', ['$event']) ondragover(event) {
        event.preventDefault();
        this.drag_over_handler(event);
    }

    private drop_handler(event) {
        var data = event.dataTransfer.getData("text/html");
        var div = document.createElement('md-list-item');
        div.innerHTML = data;
        event.target.appendChild(div);
        return false;
    }

    private drag_over_handler(event) {
        event.dataTransfer.dropEffect = "copy";
    }
}
