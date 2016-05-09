import {Phase} from "./phase";

declare var parser: any;

/**
 * Eliminating left recursion
 */
export class EoLR {
    private _grammar = [];
    private _phases = [];
    constructor() {}
    compute(raw_grammar) {
        if (raw_grammar) {
            this._compute(raw_grammar);
        } else {
            throw new Error(`grammar expected but got ${raw_grammar}`);
        }
    }

    _compute(raw_grammar) {
        // 最终结果
        this._grammar = [];
        this._phases = [];

        let old_grammar = parser.parse(raw_grammar);
        let grammar = [];

        // 合并同一个非终结符号的多个产生式
        this._phases.push(new Phase("将非终结符号排序", {line: 0}));
        this._sort(old_grammar, grammar);

        grammar.forEach((current, index) => {
            this._phases.push(new Phase(`转换第 ${index} 个非终结符号`, {index, line: 1}));
            this._replace(index, current, grammar);

            this._phases.push(new Phase(`消除第 ${index} 个非终结符号的产生式之间的立即左递归`,{index, line: 6}));
            this._eliminate(current);
        });

    }


    _sort(old_grammar, grammar) {
        let grammar_obj = {};
        old_grammar.forEach(production => {
            if (production.head in grammar_obj) {
                grammar[grammar_obj[production.head]].body.push(...production.body);
            } else {
                grammar_obj[production.head] = grammar.length;
                grammar.push({
                    head: production.head,
                    body: production.body
                });
            }
        });
    }

    _replace(index, current, grammar) {
        for (let prev_index = 0; prev_index < index; prev_index++) {
            this._phases.push(new Phase(`查看第 ${prev_index} 能否代入第 ${index} 个非终结符号的产生式中`, {index, prev_index, line: 2}));
            let new_body = [];
            current.body.forEach(e => {
                if (e[0] === grammar[prev_index].head) {
                    grammar[prev_index].body.forEach(prev_e => {
                        new_body.push(prev_e.concat(e.slice(1)));
                    })
                } else {
                    new_body.push(e);
                }
            });
            current.body = new_body;
        }
    }

    _eliminate(current) {
        // 判断是否需要消除左递归 这里通过判断产生式体中存不存在以head作为开头的
        if (current.body.some(e => e[0] === current.head)) {
            let alpha = [];
            let beta = [];
            // 提取alpha 和 beta 数组
            current.body.forEach(e => {
                if (e[0] === current.head) {
                    alpha.push(e.slice(1));
                } else {
                    beta.push(e);
                }
            });

            // 这里虽然可以合并到上面查找的时候 这里暂时分开 可能可以用在步骤里面
            let new_body = [];
            let new_production = {head: current.head + "'", body: []};

            // 生成 head 产生式
            beta.forEach(e => {
                new_body.push(e.concat(new_production.head));
            });

            // 生成 head + ' 产生式
            alpha.forEach(e => {
                new_production.body.push(e.concat(new_production.head));
            });
            new_production.body.push(["empty"]);

            current.body = new_body;
            this._grammar.push(current);
            this._grammar.push(new_production);

        } else {
            this._grammar.push(current);
        }
    }

    get grammar() {
        // if status is not ok 
        return this._grammar;
    }

    get phases() {
        // ---
        return this._phases;
    }
}
