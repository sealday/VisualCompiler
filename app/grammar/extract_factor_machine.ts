import {Phase} from "./phase";
import {Machine} from "./Machine";
/**
 * Created by xiner on 16/5/29.
 */
export class ExtractFactorMachine implements Machine{
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

    analyze(input: string) {
        try {
            this.parser.compute(input);
            this.phases = this.parser.phases;
            this.status =  "STARTED";
            this.phase = 0;

            this._update();
        } catch (e) {
            console.log(e.message);
        }
    }

    result() {
        if (this.status === "STARTED") {
            return this.parser.grammar;
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
            "按照某个顺序将非终结符号排序为 A1,A2,...,An\n",
            "for ( 从 1 到 n 的每个 i ) { \n",
            "    for ( 从 1 到 i - 1 的每个 j ) {\n",
            "        将每个形如Ai -> Ajγ的产生式替换为产生式组 Ai -> δ1γ | δ2γ | ... | δkγ \n",
            "        其中Aj -> δ1 | δ2 | ... | δk 是所有的 Aj 的产生式\n",
            "    }\n",
            "    消除Ai 产生式之间的立即左递归\n",
            "}\n"
        ];
    }
}