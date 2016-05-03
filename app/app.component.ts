import { Component } from '@angular/core';
import {GrammarComponent} from "./grammar.component";

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [GrammarComponent]
})

export class AppComponent { }