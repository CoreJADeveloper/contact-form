import 'rxjs/add/operator/let';
import { Component, Input, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// import { Router, Route} from '@angular/router';
// import { Store } from '@ngrx/store';

// import * as appSelectors from './app.selectors';
// import * as postActions from './post-data/posts.actions';
// import * as siteActions from './site-data/site-data.actions';
// import { AppState } from './app.state';
// import { SiteDataService } from './site-data/site-data.service';

@Component({
    selector: 'contact-form',
    templateUrl: './app.component.html'
})

export class AppComponent {

    private endpoint: string;
    private nonce: string;
    private component_type: string;
    private selectedTab: any;

    public constructor(public elementRef: ElementRef){
        let native_element = this.elementRef.nativeElement;
        this.endpoint = native_element.getAttribute("endpoint");
        this.nonce = native_element.getAttribute("nonce");
        this.component_type = native_element.getAttribute("type");

        this.selectedTab = 1;

        sessionStorage.setItem('site_endpoint', this.endpoint);
        sessionStorage.setItem('site_nonce', this.nonce);
        sessionStorage.setItem('default_form_type', this.component_type);
    }
}