import {EoLR} from "./EoLR";
import {extractFactor} from "./ExtractFactor";
import {FirstFollowSet} from "./FirstFollowSet";
import {PredictTable} from "./PredictTable";
import {Phase} from "./phase";
import {Predictanalyse} from "./PredictAnalyse";

export class MainController {
    lines = [];
    status = "STOPPED";
    parser = new EoLR();
    extractarith = new extractFactor();
    firstsetresult = new FirstFollowSet();
    predicttable = new PredictTable();
    output = "";
    extracleftoutput = "";
    firfolsetoutput = "";
    predictgrammar = [];
    predictterminal = [];
    text = "";
    phases: Phase[];
    phase: number;
    lineNumber: number;
    input = "";
    predicttablestep: Array<any>;
    new_grammars:Array<any>;

    grammarname: string;

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
        this.firstsetresult = new FirstFollowSet();
        this.predicttable = new PredictTable();
        this.output="";
        this.extracleftoutput = "";
        this.firfolsetoutput="";
        this.predictgrammar = [];
        this.predictterminal=[];
        this.grammarname = "未命名"
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
            this.output = this.printoutput(this.parser.grammar);
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
        this.extractarith._extract(this.parser.grammar);
        this.extracleftoutput = this.printoutput(this.extractarith.new_grammar);

    }


    findFirstSet(){
        this.firstsetresult._findFirst(this.extractarith.new_grammar);

        let keyset = Object.keys(this.firstsetresult.first);
        for (var kn = 0; kn < keyset.length; kn++) {
            var valueset = this.firstsetresult.first[keyset[kn]];
            this.firfolsetoutput += keyset[kn] + ":{";
            for (var vn = 0; vn < valueset.length; vn++) {
                this.firfolsetoutput += valueset[vn] + ",";
            }
            this.firfolsetoutput += "}\n";
        }

        this.firfolsetoutput += "follow集合:\n";

        let keyset1 = Object.keys(this.firstsetresult.follow_set);
        for (var kn = 0; kn < keyset1.length; kn++) {
            var valueset = this.firstsetresult.follow_set[keyset1[kn]];
            this.firfolsetoutput += keyset1[kn] + ":{";
            for (var vn = 0; vn < valueset.length; vn++) {
                this.firfolsetoutput += valueset[vn] + ",";
            }
            this.firfolsetoutput += "}\n";
        }



    }

    upload() {
        console.log("hello world");
        let uploadButton: any = document.querySelector("#upload")
        uploadButton.click();
    }


    generatePredict(){
        this.predictgrammar = this.predicttable._predicttable(this.extractarith.new_grammar,this.firstsetresult.first,this.firstsetresult.follow_set);
        let afterpredictgrammar = angular.copy(this.predictgrammar);

        this.predictterminal = this.predicttable.terminalset;
        this.predictgrammar.forEach((current)=>{
            for(let i =0;i<this.predicttable.terminalset.length;i++){
                if(current.generate[i].length == 0){
                    current.generate[i] = "";
                }else{
                    let allperdict = "";
                    current.generate[i].forEach((currentsymbol)=>{
                        let symbol ="";
                        currentsymbol.forEach((currentsymbolper)=>{
                            symbol+=currentsymbolper;
                        });
                        allperdict +=`${current.nonterminal}->${symbol}\n`;

                    });
                    current.generate[i]=allperdict;
                }
            }

        });

        this._convertToMap(afterpredictgrammar,this.predictterminal);

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

    _convertToMap(aftergrammar,terminalset){
        let new_grammars =[];
        aftergrammar.forEach((current)=>{
            let new_grammar = {nonterminal:"", generate: []};
            new_grammar.nonterminal = current.nonterminal;
            for(let i = 0; i< current.generate.length;i ++){
                new_grammar.generate[terminalset[i]] = current.generate[i];

            }
            new_grammars.push(new_grammar);
        });
        console.log(new_grammars);
        this.new_grammars = new_grammars;
    }




    /**
     * 打印预测分析表步骤
     */
    predictTableStep(){
        let predictAnalyse = new Predictanalyse();
        this.predicttablestep =  predictAnalyse._predictanalyse(this.parser.grammar,this.new_grammars);
    }

    printarraybyindex(array){
        let output = "";
        array.forEach((current)=>{
            output += current;
        });
        return output;
    }

    printarraybyindexreverse(array){
        let output = "";
        array.reverse().forEach((current)=>{
            output += current;
        });
        return output;
    }
}
    
