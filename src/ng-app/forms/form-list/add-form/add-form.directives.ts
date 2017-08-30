import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[dragTextField]' })
export class DragTextFieldDirective {

    constructor(private el: ElementRef) { }

    @HostListener('dragstart', ['$event']) ondragstart(event) {
        this.dragstart_handler(event);
    }

    private dragstart_handler(event) {
        event.dataTransfer.setData("text/plain", "<p>Example paragraph</p>");
        event.dataTransfer.setData("text/html", "<p>Example paragraph</p>");
        event.dataTransfer.setData("text/uri-list", "http://developer.mozilla.org");
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
        var data = event.dataTransfer.getData("text");
        var div = document.createElement('div');
        div.innerHTML = data;
        event.target.appendChild(div);
    }

    private drag_over_handler(event) {
        event.dataTransfer.dropEffect = "copy";
    }
}
