import {Component, ElementRef, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange} from '@angular/core';

@Component({
    selector: 'grammar',
    templateUrl: 'app/components/grammar.component.html',
    styleUrls: ['app/components/grammar.component.css']
})

export class GrammarComponent {
    @Output('grammar')
    grammarEmitter = new EventEmitter<string>();
    
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
        reader.onload = e => {
            // 这里应该只要给 e 指明下类型也可以不报错
            // 暂时还没有找到类型 因此这里先 suppress 一下
            //noinspection TypeScriptUnresolvedVariable
            this.grammarChange(e.target.result);
        };
        reader.readAsText(file);
    }
    
    grammarChange(grammar) {
        this.grammarEmitter.emit(grammar);
    }
}
