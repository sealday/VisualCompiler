import {Machine} from "./Machine";
import {Phase} from "./phase";
/**
 * Created by xiner on 16/5/29.
 */
export  class  PredictAnalyseMachine implements Machine{
    
    phase: number;
    phases: [Phase];
    text: string;
    lineNumber: number;
    status: string;

    constructor(private parser: any) {
        this.status = "STOPPED";
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

    analyze(options) {
        let userinput = this.parser._parseUserinput(options.input);
        this.parser._predictanalyse(options.grammar, options.new_grammars, userinput);
        this.phases = this.parser._phrase;
        this.status =  "STARTED";
        this.phase = 0;

        this._update();
    }

    result() {
        if (this.status === "STARTED") {
            return this.parser.predictTable;
        } else {
            throw "should analyze first!";
        }
    }

    current() {
        return {
            lineNumber: this.lineNumber,
            text: this.text
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

    lines() {
        return [
            "设置ip使他指向w的第一个符号,其中ip是输入指针\n",
            "令X=栈顶符号\n",
            "while(X != $){/*栈非空*/\n",
            "   if(X等于ip所指向的符号a) 执行弹出栈的操作,将ip向前移动一个位置;\n",
            "   else if(X是一个终结符号) error();\n",
            "   else if(M[X,a]是一个报错条目)error();\n",
            "   else if(M[X,a]=X->Y1 Y2 ...Yk){\n",
            "       输出产生式X->Y1Y2...Yk;\n",
            "       弹出栈顶符号;\n",
            "       将Yk,Yk-1,...Y1压入栈中,之中Y1位于栈顶。\n",
            "   }\n",
            "   令X=栈顶符号;\n",
            "}\n"
        ];
    }
    
}