System.register(['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var GrammarComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            GrammarComponent = (function () {
                function GrammarComponent(_el) {
                    this._el = _el;
                    this.grammarEmitter = new core_1.EventEmitter();
                }
                /**
                 * 处理加载文件的点击事件
                 */
                GrammarComponent.prototype.loadFile = function () {
                    this._el.nativeElement.querySelector("input[type=file]").click();
                };
                /**
                 * 处理选择完文件的事件
                 */
                GrammarComponent.prototype.fileSelected = function ($event) {
                    this._handleFile($event.target.files[0]);
                };
                GrammarComponent.prototype.dragenter = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                };
                GrammarComponent.prototype.dragover = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                };
                GrammarComponent.prototype.drop = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var dt = e.dataTransfer;
                    var files = dt.files;
                    console.log(files);
                    this._handleFile(files[0]);
                };
                GrammarComponent.prototype._handleFile = function (file) {
                    var _this = this;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        // 这里应该只要给 e 指明下类型也可以不报错
                        // 暂时还没有找到类型 因此这里先 suppress 一下
                        //noinspection TypeScriptUnresolvedVariable
                        _this.grammarChange(e.target.result);
                    };
                    reader.readAsText(file);
                };
                GrammarComponent.prototype.grammarChange = function (grammar) {
                    this.grammarEmitter.emit(grammar);
                };
                __decorate([
                    core_1.Output('grammar'), 
                    __metadata('design:type', Object)
                ], GrammarComponent.prototype, "grammarEmitter", void 0);
                GrammarComponent = __decorate([
                    core_1.Component({
                        selector: 'grammar',
                        templateUrl: 'app/components/grammar.component.html',
                        styleUrls: ['app/components/grammar.component.css']
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], GrammarComponent);
                return GrammarComponent;
            }());
            exports_1("GrammarComponent", GrammarComponent);
        }
    }
});
//# sourceMappingURL=grammar.component.js.map