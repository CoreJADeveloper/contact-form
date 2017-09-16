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
                if(target.classList.contains('no-drop')){
                    return false;
                }else{
                    return true;
                }
            },
            copy: true,
            copySortSource: true,
        });

        dragulaService.drag.subscribe((value) => {
            console.log(value);
            // this.onDrag(value.slice(1));
        });
        dragulaService.drop.subscribe((value) => {
            // this.onDrop(value.slice(1));
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
        let [e, el] = args;
        this.removeClass(e, 'ex-moved');
    }

    private onDrop(args) {
        let [e, el] = args;
        this.addClass(e, 'ex-moved');
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