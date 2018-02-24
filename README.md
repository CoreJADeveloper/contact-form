# Angular Contact Form Builder
A simple contact form builder WordPress plugin, developed with Angular and Angular material design.

Angular Contact Form Builder is an application based WordPress plugin. I used some cool npm packages to integrate Angular within the WordPress plugin.

Following are the required packages, I used in my application -

```
"devDependencies": {
    "@ngtools/webpack": "^1.6.1",
    "@types/core-js": "^0.9.43",
    "@types/node": "^8.0.24",
    "angular2-template-loader": "^0.6.2",
    "awesome-typescript-loader": "^3.2.3",
    "css-loader": "^0.28.5",
    "extract-text-webpack-plugin": "^3.0.0",
    "node-sass": "^4.5.3",
    "postcss-loader": "^2.0.6",
    "postcss-object-fit-images": "^1.1.2",
    "raw-loader": "^0.5.1",
    "sass-loader": "^6.0.6",
    "typescript": "^2.5.1",
    "uglifyjs-webpack-plugin": "^1.2.2",
    "webpack": "^3.11.0"
  },
  "dependencies": {
    "@angular/animations": "^5.2.3",
    "@angular/cdk": "^5.2.0",
    "@angular/common": "^4.3.5",
    "@angular/compiler": "^4.3.5",
    "@angular/compiler-cli": "^4.3.5",
    "@angular/core": "^4.3.5",
    "@angular/forms": "^4.3.5",
    "@angular/http": "^4.3.5",
    "@angular/material": "^5.2.0",
    "@angular/platform-browser": "^4.3.5",
    "@angular/platform-browser-dynamic": "^4.3.5",
    "@angular/router": "^4.3.5",
    "autoprefixer": "^7.1.2",
    "core-js": "^2.5.0",
    "material-design-icons": "^3.0.1",
    "ng2-dragula": "^1.5.0",
    "rxjs": "^5.5.6",
    "web-animations-js": "^2.3.1",
    "wpapi": "^1.1.2",
    "zone.js": "^0.8.16"
  },
```
In admin panel, there is a menu page named ngContact Forms. Angular and Angular material design are integrated within the menu page. Angular component `<contact-form ...></contact-form>` handles all operations according to component parameters. 

Initially, in set up page user can create a basic/blank form. In edit page, user can build a complete form. Currently, only some basic form fields are integrated but later I have plan to integrate many new custom fields. 

I used `ng2-dragula` to handle drag & drop functionality of form fields. To handle WordPress rest API there is a cool npm package named `wpapi` which performs all rest API request and response within the builder. I created some custom routes for handling WordPress rest API through verifying nonce of a browser.

Basically, Angular makes the application much more faster through real time data binding of DOM and component data. I used two way data bindings in many places which enables to real time preview of customizations. `@Input` and `@Output` are very strong features of Angular which enables real time data communication between parent and child component. 

Angular material design makes the application unique by rendering awesome UI that is totally different then as usual WordPress look and feel. Also, I used Angular animation which make the UI much more attractive.
