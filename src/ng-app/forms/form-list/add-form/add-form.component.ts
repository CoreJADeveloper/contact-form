import {Component, OnInit, ComponentFactoryResolver, ViewChild} from '@angular/core';
// import {DragTextFieldDirective, DropFieldsDirective} from './add-form.directives';

import { AddFormDirective } from './add-form.directives';

import { AddFormService } from './add-form.service';

import {DragulaService} from 'ng2-dragula/ng2-dragula';

@Component({
    selector: 'add-form',
    templateUrl: './add-form.component.html'
})

export class AddFormViewComponent implements OnInit {

    @ViewChild(AddFormDirective) addFormDirective: AddFormDirective;

    shadow: any = null;

    constructor(private dragulaService: DragulaService, private componentFactoryResolver: ComponentFactoryResolver, private addFormService: AddFormService) {
        const bag: any = this.dragulaService.find('dragged-dropped');
        if (bag !== undefined )
            this.dragulaService.destroy('dragged-dropped');
        dragulaService.setOptions("dragged-dropped", {
            direction: "vertical",
            revertOnSpill: true,
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
            // console.log("over");
        });
        dragulaService.out.subscribe((value) => {
            // this.onOut(value.slice(1));
            // console.log("out");
        });
        dragulaService.shadow.subscribe((value) => {
            // this.onShadow(value.slice(1));

        });
        dragulaService.dragend.subscribe((value) => {
            // this.onDragend(value.slice(1));
            // console.log("out");
            // this._shadow.remove();
            // this._shadow = null;
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

        let viewContainerRef = this.addFormDirective.viewContainerRef;

        if (this.hasClass(draggedElement, "is-draggable")) {
            this.addFormService.addDynamicComponent(viewContainerRef, draggedElement);
        }
    }

    private onOver(args) {
        // let [e, el, container] = args;
        // let drop_elements = document.getElementById("drop-area").innerHTML;
        // let drop_zone = document.createElement("div");
        // drop_zone.innerHTML = drop_elements;
        // e.replaceWith(drop_zone);
        // console.log(e);
        // this.addClass(el, 'ex-over');
    }

    private onOut(args) {
        // let [e, el, container] = args;
        // let drop_elements = document.getElementById("drop-area").innerHTML;
        // let drop_zone = document.createElement("div");
        // drop_zone.innerHTML = drop_elements;
        // e.replaceWith(drop_zone);
        // this.removeClass(el, 'ex-over');
    }

    private onShadow(args){
        let [el, container, source] = args;
        console.log(args);
        let drop_zone;
        if (!this.shadow){
            let drop_elements = document.getElementById("drop-area").innerHTML;
            drop_zone = document.createElement("div");
            drop_zone.innerHTML = drop_elements;
            this.shadow = drop_zone;
            this.shadow.classList.add("gu-transit");
        }

        if (this.hasClass(container, "no-drop")) {

        }else{
            console.log(this.shadow);
            // el.style.display = 'none';
            // el.parentNode.insertBefore(this.shadow, el);
            el.replaceWith(this.shadow);
        }

        // e.replaceWith(this.shadow);


        // e.replaceWith(drop_zone);
        // console.log(args);
    }

    private onDragend(args){
        let[e] = args;
        console.log("Dragend: ");
        console.log(e);
        // this.shadow = e;
        e.remove();
        this.shadow.remove();
        this.shadow = null;
    }

    ngOnInit(): void {
    }


}