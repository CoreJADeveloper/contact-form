import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {NgModule}      from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {Routes} from '@angular/router';
// import { AppService } from './app.service';
// import { StoreModule } from '@ngrx/store';
// import { EffectsModule } from '@ngrx/effects';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
//
import {AppComponent}   from './app.component';
// import { HomeViewComponent, PostViewComponent } from './views';
// import { PostItemComponent, PostListComponent } from './components';
// import { AppService } from './app.service';
// import { SiteDataService } from './site-data/site-data.service';
// import { PostService } from './post-data/posts.service';
// import { reducer } from './app.reducer';
// import { initialRoutes } from './app.routes';
// import { PostEffects } from './post-data/posts.effects';
// import { CanDeactivateHomeGuard, CanDeactivatePostGuard } from './views/guards';

import {MdButtonModule, MdCheckboxModule} from '@angular/material';

const routes: Routes = [
    { path: 'page=ang-contact-form', component: AppComponent }
];

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        MdButtonModule,
        MdCheckboxModule
        // RouterModule.forRoot(routes),
        // StoreModule.provideStore(reducer()),
        // EffectsModule.run(PostEffects),
        // StoreDevtoolsModule.instrumentOnlyWithExtension(),
    ],
    declarations: [
        AppComponent,
        // HomeViewComponent,
        // PostViewComponent,
        // PostListComponent,
        // PostItemComponent
    ],
    providers: [
        // AppService,
        // SiteDataService,
        // PostService,
        // CanDeactivateHomeGuard,
        // CanDeactivatePostGuard
    ]
})

export class AppModule {
}
