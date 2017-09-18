import {Component, OnInit} from '@angular/core';
// import {DragTextFieldDirective, DropFieldsDirective} from './add-form.directives';

import {DragulaService} from 'ng2-dragula/ng2-dragula';

@Component({
    selector: 'add-form',
    templateUrl: './add-form.component.html'
})

export class AddFormViewComponent implements OnInit {

    constructor(private dragulaService: DragulaService) {
        dragulaService.setOptions("dragged-dropped", {
            direction: "vertical",
            removeOnSpill: true,
            moves: function(el, container, handle){
                return true;
            },
            accepts: function(el, target, source, sibling) {
                let defaultAccept = true;

                if(target.classList.contains('no-drop')){
                    return false;
                }

                return defaultAccept;
            },
            copy: function(el,source) {
                return source.classList.contains('no-drop');
            },
            copySortSource: true,
        });

        dragulaService.drag.subscribe((value) => {
            this.onDrag(value.slice(1));
        });
        dragulaService.drop.subscribe((value) => {
            // console.log(value);
            this.onDrop(value.slice(1));
        });
        dragulaService.over.subscribe((value) => {
            // this.onOver(value.slice(1));
        });
        dragulaService.out.subscribe((value) => {
            // this.onOut(value.slice(1));
        });
    }

    private hasClass(el: any, name: string) {
        return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
    }

    private addClass(el: any, name: string) {
        if (!this.hasClass(el, name)) {
            el.className = el.className ? [el.className, name].join(' ') : name;
        }
    }

    private removeClass(el: any, name: string) {
        if (this.hasClass(el, name)) {
            el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
        }
    }

    private onDrag(args) {
        // this.removeClass(draggedElement, 'ex-moved');
    }

    private onDrop(args) {
        let [draggedElement, draggedElementContainer] = args;

        if (this.hasClass(draggedElement, "textfield-dragged")) {
            let idName = "form-textfield";
            this.replaceDraggedElement(draggedElement, idName);
        }

        else if (this.hasClass(draggedElement, "textarea-dragged")) {
            let idName = "form-textarea";
            this.replaceDraggedElement(draggedElement, idName);
        }

        else if (this.hasClass(draggedElement, "radiobutton-dragged")) {
            let idName = "form-radiobutton";
            this.replaceDraggedElement(draggedElement, idName);
        }

        else if (this.hasClass(draggedElement, "emailfield-dragged")) {
            let idName = "form-emailfield";
            this.replaceDraggedElement(draggedElement, idName);
        }

        else if (this.hasClass(draggedElement, "numberfield-dragged")) {
            let idName = "form-numberfield";
            this.replaceDraggedElement(draggedElement, idName);
        }

        else if (this.hasClass(draggedElement, "checkbox-dragged")) {
            let idName = "form-checkbox";
            this.replaceDraggedElement(draggedElement, idName);
        }
    }

    private replaceDraggedElement(draggedElement: any, idName: string){
        let field_dom = document.getElementById(idName).innerHTML;
        let list_item = document.createElement('md-list-item');
        list_item.innerHTML = field_dom;
        draggedElement.replaceWith(list_item);
    }

    private onOver(args) {
        let [e, el, container] = args;
        this.addClass(el, 'ex-over');
    }

    private onOut(args) {
        let [e, el, container] = args;
        this.removeClass(el, 'ex-over');
    }

    ngOnInit(): void {
    }

    // dragstart_handler(event: any): void {
    //     console.log("dragStart");
    //     // Add the target element's id to the data transfer object
    //     event.dataTransfer.setData("text/plain", event.target.id);
    // }


}