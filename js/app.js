(function(){
    'use strict';
    
    class MainController {

        constructor() {
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
        .controller('MainController', MainController)
        .controller('LeftController', ($scope) => {
            
            console.log(leftRecursiveService.getName());
            
            $scope.some = [1, 2, 3, 4, 5];
            
            $scope.stepping = false;
            $scope.grammarInput = "";
            $scope.grammarOutput = "";
            $scope.items = [];
            let statements = [];
            let step_counter = 0;
            let count = 0;
            
            $scope.step = () => {
                if ($scope.stepping) {
                    
                    if (step_counter >= statements.length) {
                        $scope.stepping = false;
                        return;
                    }
                    
                    let g = parser.parse(statements[step_counter]);
                    let recursive = false;
                    let beta = [];
                    let alpha = [];
                    for (let i = 0; i < g.body.length; i++) {
                        if (g.body[i][0] == g.head) {
                            recursive = true;
                            g.body[i].shift();
                            alpha.push(g.body[i]);
                        } else {
                            beta.push(g.body[i]);
                        }
                    }
                    if (recursive) {
                        let a = {head: g.head, body: []};
                        for (let i = 0; i < beta.length; i++) {
                            beta[i].push(g.head + '\'');
                            a.body.push(beta[i]);
                        }

                        let a1 = {head: g.head + '\'', body: []};
                        for (let i = 0; i < alpha.length; i++) {
                            alpha[i].push(g.head + '\'');
                            a1.body.push(alpha[i]);
                        }
                        a1.body.push(['ϵ']);
                        $scope.grammarOutput += `产生式 ${count} ${beautifyGrammar(a)} \n`;
                        $scope.items.push(`产生式 ${count} ${beautifyGrammar(a)} \n`);
                        count++;
                        $scope.grammarOutput += `产生式 ${count} ${beautifyGrammar(a1)} \n`;
                        $scope.items.push(`产生式 ${count} ${beautifyGrammar(a1)} \n`);
                        console.log(beautifyGrammar(g));
                    } else {
                        $scope.grammarOutput += `产生式 ${count} ${beautifyGrammar(g)} \n`;
                        $scope.items.push(`产生式 ${count} ${beautifyGrammar(g)} \n`);
                    }
                    
                } else {
                    // 初始化单步
                    $scope.stepping = true;
                    $scope.items = [];
                    $scope.grammarOutput = "";
                    statements = [];
                    step_counter = 0;
                    count = 1;
                    
                    let crude_statements = $scope.grammarInput.split("\n");
                    crude_statements.forEach(s => {
                        if (s.trim()) {
                            statements.push(s);
                        }
                    });

                    let g = parser.parse(statements[step_counter]);
                    let recursive = false;
                    let beta = [];
                    let alpha = [];
                    for (let i = 0; i < g.body.length; i++) {
                        if (g.body[i][0] == g.head) {
                            recursive = true;
                            g.body[i].shift();
                            alpha.push(g.body[i]);
                        } else {
                            beta.push(g.body[i]);
                        }
                    }
                    if (recursive) {
                        let a = {head: g.head, body: []};
                        for (let i = 0; i < beta.length; i++) {
                            beta[i].push(g.head + '\'');
                            a.body.push(beta[i]);
                        }

                        let a1 = {head: g.head + '\'', body: []};
                        for (let i = 0; i < alpha.length; i++) {
                            alpha[i].push(g.head + '\'');
                            a1.body.push(alpha[i]);
                        }
                        a1.body.push(['ϵ']);
                        $scope.grammarOutput += `产生式 ${count} ${beautifyGrammar(a)} \n`;
                        $scope.items.push(`产生式 ${count} ${beautifyGrammar(a)} \n`);
                        count++;
                        $scope.grammarOutput += `产生式 ${count} ${beautifyGrammar(a1)} \n`;
                        $scope.items.push(`产生式 ${count} ${beautifyGrammar(a1)} \n`);
                        console.log(beautifyGrammar(g));
                    } else {
                        $scope.grammarOutput += `产生式 ${count} ${beautifyGrammar(g)} \n`;
                        $scope.items.push(`产生式 ${count} ${beautifyGrammar(g)} \n`);
                    }
                    
                }
                
                count++;
                step_counter++;
            };
            
            $scope.finish = () => {
                return step_counter >= statements.length;
            };
            
            $scope.stop = () => {
                $scope.stepping = false;
            };
            
            $scope.beautify = () => {
                let statements = $scope.grammarInput.split('\n');
                console.log(statements);
                $scope.grammarInput = '';
                console.dir(statements);
                statements.forEach(e => {
                    if (e.trim()) {
                        $scope.grammarInput += `${beautifyGrammar(parser.parse(e))} \n`;
                    }
                });
            };
            $scope.convert = () => {
                $scope.items = [];
                let statements = $scope.grammarInput.split("\n");
                $scope.grammarOutput = "";
                let count = 0;
                statements.forEach(e => {
                    if (e.trim()) {
                        count++;

                        let g = parser.parse(e);
                        let recursive = false;
                        let beta = [];
                        let alpha = [];
                        for (let i = 0; i < g.body.length; i++) {
                            if (g.body[i][0] == g.head) {
                                recursive = true;
                                g.body[i].shift();
                                alpha.push(g.body[i]);
                            } else {
                                beta.push(g.body[i]);
                            }
                        }
                        if (recursive) {
                            let a = {head: g.head, body: []};
                            for (let i = 0; i < beta.length; i++) {
                                beta[i].push(g.head + '\'');
                                a.body.push(beta[i]);
                            }

                            let a1 = {head: g.head + '\'', body: []};
                            for (let i = 0; i < alpha.length; i++) {
                                alpha[i].push(g.head + '\'');
                                a1.body.push(alpha[i]);
                            }
                            a1.body.push(['ϵ']);
                            $scope.grammarOutput += `产生式 ${count} ${beautifyGrammar(a)} \n`;
                            $scope.items.push(`产生式 ${count} ${beautifyGrammar(a)} \n`);
                            count++;
                            $scope.grammarOutput += `产生式 ${count} ${beautifyGrammar(a1)} \n`;
                            $scope.items.push(`产生式 ${count} ${beautifyGrammar(a1)} \n`);
                            console.log(beautifyGrammar(g));
                        } else {
                            $scope.grammarOutput += `产生式 ${count} ${beautifyGrammar(g)} \n`;
                            $scope.items.push(`产生式 ${count} ${beautifyGrammar(g)} \n`);
                        }
                    }
                })
            };

            function beautifyGrammar(obj) {
                let body = [];
                obj.body.forEach(e => {
                    body.push(e.join(' '));
                });

                return obj.head + " -> " + body.join(' | ');
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
