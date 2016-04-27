(function(){
    "use strict";

    /**
     * STOPPED READY
     */
    class LeftRecursiveService {
        constructor() {
            this.status = "STOPPED";
        }

        /**
         * 初始化状态
         * 这个过程会合并同一个非终结符号的表达式
         * 这个过程会抛出异常
         * @param grammar 初始文法
         */
        init(grammar) {
            try {
                let rawGrammar = parser.parse("_grammar");
                
                
                this.status = "READY";
            } catch (e) {
                throw e;
            }
        }

        /**
         * 步进
         */
        step() {
            if (this.status === "READY") {
                this._step();
            } else {
                throw new Error("step must after init!");
            }
        }
        
        _step() {

        }

        /**
         * 将重置所有的状态 包括清除保存的文法
         * reset 之后必须调用 init
         */
        reset() {
            this.status = "STOPPED";
        }
    }
    
    angular
        .module('visualCompiler')
        .service('leftRecursiveService', LeftRecursiveService);

})();