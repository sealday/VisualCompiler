import {EoLR} from "./eolr";
import {extractFactor} from "./extract_factor";
import {FirstFollowSet} from "./first_follow_set";
import {PredictTable} from "./predict_table";
import {Phase} from "./phase";
import {Predictanalyse} from "./predict_analyse";
import {ExtractFactorMachine} from "./extract_factor_machine";
import {Machine} from "./Machine";
import {PredictAnalyseMachine} from "./predict_analyse_machine";

// TODO 应该改成 GrammarController
export class MainController {
    predictlines=[];
    status = "STOPPED";
    parser:EoLR;
    predictAnalyse:Predictanalyse;
    extractarith = new extractFactor();
    firstsetresult = new FirstFollowSet();
    predicttable = new PredictTable();
    output = "";
    extracleftoutput = "";
    firfolsetoutput = "";
    predictgrammar = [];
    predictterminal = [];
    phases: Phase[];
    phase: number;
    input = "";
    predicttablestep: Array<any>;
    new_grammars:Array<any>;
    predictuserinput ="";
    machines: Map<string, Machine> = new Map<string, Machine>();


    grammarname: string;

    constructor() {

        this.parser = new EoLR();
        this.extractarith = new extractFactor();
        this.firstsetresult = new FirstFollowSet();
        this.predicttable = new PredictTable();
        this.output="";
        this.extracleftoutput = "";
        this.firfolsetoutput="";
        this.predictgrammar = [];
        this.predictterminal=[];
        this.grammarname = "未命名";
        this.predictAnalyse = new Predictanalyse();

        this.machines.set("ef", new ExtractFactorMachine(this.parser));
        this.machines.set("pa",new PredictAnalyseMachine(this.predictAnalyse));
    }
    
    getLines(name) {
        return this.machines.get(name).lines();
    }
    
    getLineNumber(name) {
        return this.machines.get(name).current().lineNumber;
    }
    
    getText(name) {
        return this.machines.get(name).current().text;
    }
    
    canAnalyze(name) {
        return this.machines.get(name).canAnalyze();
    }

    stop(name) {
        this.machines.get(name).stop();
    }

    analyze(name) {
        switch (name) {
            case "ef":
                this.machines.get(name).analyze(this.input);
                this.output = this.printoutput(this.machines.get(name).result());
                break;
            case "pa":
                this.machines.get(name).analyze({
                    grammar: this.parser.grammar,
                    new_grammars: this.new_grammars,
                    input: this.predictuserinput
                });
                this.predicttablestep = this.machines.get(name).result();
                break;
            default:
                throw "no support machine!";
        }

    }

    canNext(name) {
        return this.machines.get(name).canNext();
    }

    next(name) {
        return this.machines.get(name).next();
    }

    canPrev(name) {
        return this.machines.get(name).canPrev();
    }

    prev(name) {
        return this.machines.get(name).prev();
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
        this.new_grammars = new_grammars;
    }




    // /**
    //  * 打印预测分析表步骤
    //  */
    // predictTableStep(){
    //     let predictAnalyse = new Predictanalyse();
    //     let userinput = predictAnalyse._parseUserinput(this.predictuserinput);
    //     this.predicttablestep =  predictAnalyse._predictanalyse(this.parser.grammar,this.new_grammars,userinput);
    //     this.phases = predictAnalyse._phrase;
    // }

    printarraybyindex(array){
        let output = "";
        array.forEach(current => {
            output += current;
        });
        return output;
    }

    printarraybyindexreverse(array){
        let output = "";
        array.splice(0).reverse().forEach(current => {
            output += current;
        });
        return output;
    }
}
    
