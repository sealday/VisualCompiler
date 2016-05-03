import {Component} from '@angular/core';
import {GrammarComponent} from "./grammar.component";

// import * as Parser from './parser.js';

@Component({
    selector: 'my-app',
    templateUrl: 'app/components/app.component.html',
    directives: [GrammarComponent]
})

export class AppComponent { 
    currentGrammar: string;
    
    grammarHandler(grammar) {
        console.log(grammar);
    }
}
