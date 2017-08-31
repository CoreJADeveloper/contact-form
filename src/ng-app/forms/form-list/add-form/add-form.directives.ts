import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[dragTextField]' })
export class DragTextFieldDirective {

    constructor(private el: ElementRef) { }

    @HostListener('dragstart', ['$event']) ondragstart(event) {
        this.dragstart_handler(event);
    }

    private dragstart_handler(event) {
        let textfield_dom = "";
        event.dataTransfer.setData("text", "<ang-textfield></ang-textfield>");
        event.dataTransfer.setData("text/plain", "<ang-textfield></ang-textfield>");
        event.dataTransfer.setData("text/html", "<ang-textfield></ang-textfield>");
        event.dataTransfer.setData("text/uri-list", "<ang-textfield></ang-textfield>");
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
        var div = document.createElement('div');
        div.innerHTML = data;
        console.log(div);
        event.target.appendChild(div);
        return false;
    }

    private drag_over_handler(event) {
        event.dataTransfer.dropEffect = "copy";
    }
}
