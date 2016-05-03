(function(){
    'use strict';
    
    class MainController {

        constructor($scope) {
            this.lines = [
                "按照某个顺序将非终结符号排序为 A1,A2,...,An\n",
                "for ( 从 1 到 n 的每个 i ) { \n",
                "    for ( 从 1 到 i - 1 的每个 j ) {\n",
                "        将每个形如Ai -> Ajγ的产生式替换为产生式组 Ai -> δ1γ | δ2γ | ... | δkγ \n",
                "        其中Aj -> δ1 | δ2 | ... | δk 是所有的 Aj 的产生式\n",
                "    }\n",
                "    消除Ai 产生式之间的立即左递归\n",
                "}\n"
            ];
            this.status = "STOPPED";
            this.parser = new EoLR();
            this.extractarith = new extractFactor();
            this.output="";
            this.extracleftoutput = "";
        }
        
        _update() {
            this.text = this.phases[this.phase].text;
            this.lineNumber = this.phases[this.phase].extra.line;
        }
        
        canAnalyze() {
            return this.status === "STOPPED";
        }
        
        stop() {
            this.status = "STOPPED";
        }
        
        analyze() {
            try {
                this.parser.compute(this.input);
                this.output = this.printoutput(this.parser._grammar);
                this.phases = this.parser.phases;
                this.status =  "STARTED";
                this.phase = 0;

                this._update();
            } catch (e) {
                console.log(e.message);
            }
        }
        
        canNext() {
            if (this.status === "STARTED") {
                return this.phase + 1 < this.phases.length;
            }
            return false;
        }
        
        next() {
            if (this.canNext()) {
                this.phase++;
                this._update();
            }
        }
        
        canPrev() {
            if (this.status === "STARTED") {
                return this.phase > 0;
            }
            return false;
        }
        
        prev() {
            if (this.canPrev()) {
                this.phase--;
                this._update();
            }
        }

        //点击上传文件之后,读取文件内容显示到textarea里面
        fileHandler(result) {
            this.input=result;
        }

        extract(){
            this.extractarith._extract(this.parser._grammar);
           this.extracleftoutput = this.printoutput(this.extractarith.new_grammar);

        }

        /**
         * 将结果打印在页面上
         * @param grammar
         * @returns {string}
         */
        printoutput(grammar){
            let outputmodel = "";
            grammar.forEach((current)=> {
                outputmodel += `${current.head}->`;
                current.body.forEach((bodycurrent)=>{
                    bodycurrent.forEach((bodycurrentnow)=>{
                        outputmodel += bodycurrentnow;
                    });
                    outputmodel += "|";
                });
                outputmodel = outputmodel.substr(0,outputmodel.length-1);
                outputmodel +="\n";
            });

            return outputmodel;
        }
    }
    
    angular
        .module('visualCompiler', ['ngAnimate'])
        .controller('AnalyseController', $scope => {
            $scope.phaseIndex = 1;
            $scope.phases = [
                {text:"状态 0 入栈;\n", style:{background: 'red'}},
                {text:"把下一个输入符号读入 a 中;\n", style:{background: 'red'}},
                {text:"DO\n", style:{background: 'red'}}
            ];
        })
        .controller('MainController', () => new MainController())
        .directive('fileChange', function() {
            return {
                restrict: 'A',
                scope: {
                    fileChange: '&'
                },
                link: function(scope, element) {
                    element.on('change', onChange);
                    scope.$on('destroy', function() {
                        element.off('change', onChange);
                    });
                    function onChange() {
                        let reader = new FileReader();
                        reader.onload = function(evt) {
                            scope.$apply(function() {
                                scope.fileChange ({result: evt.target.result});
                            });
                        };
                        reader.readAsText(element[0].files[0]);
                    }
                }
            }
        });


    // Without JQuery
    let slider = new Slider('#ex1', {
        formatter: (value) => 'Current value: ' + value
    });
    let pre = d3.select("pre#phase");
    let director =
        `状态 0 入栈;
把下一个输入符号读入 a 中;
DO
    把栈顶元素读进 Sm 中;
    IF ACTION[Sm, a] = 移进
        s = GOTO[Sm, a];
        s 压栈;
        读入下一个符号;
    ELSE IF ACTION[Sm, a] = 归约;
        按 ACTION[Sm, a] 的产生式 A → β 归约
        |β| 个状态出栈;
        GOTO [Sm - r, A] 入栈;
    ELSE IF ACTION[Sm, a] = 接受
        分析成功;
    ELSE
        报告错误;
WHILE TRUE`
            .split("\n");

    let span = pre.selectAll("span").data(director);

    span.enter()
        .append("span")
        .attr("class", (d, i) => `line${i}`);
    span.text(d => `${d}\n`);
   
})();
