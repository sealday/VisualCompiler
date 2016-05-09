import {Component, ElementRef, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'grammar',
    templateUrl: 'app/components/grammar.component.html',
    styleUrls: ['app/components/grammar.component.css']
})
export class GrammarComponent {
    @Output('grammar')
    grammarEmitter = new EventEmitter<string>();
    
    grammar: string;

    constructor(private _el: ElementRef) { }

    /**
     * 处理加载文件的点击事件
     */
    loadFile() {
        this._el.nativeElement.querySelector("input[type=file]").click();
    }

    /**
     * 处理选择完文件的事件
     */
    fileSelected($event) {
        this._handleFile($event.target.files[0]);
    }

    dragenter(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    dragover(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    drop(e) {
        e.stopPropagation();
        e.preventDefault();

        let dt = e.dataTransfer;
        let files = dt.files;
        console.log(files);

        this._handleFile(files[0]);
    }

    private _handleFile(file) {
        let reader = new FileReader();
        reader.onload = () => {
            this.grammarChange(reader.result);
            this.grammar = reader.result;
        };
        reader.readAsText(file);
    }

    grammarChange(grammar) {
        this.grammarEmitter.emit(grammar);
    }
}
