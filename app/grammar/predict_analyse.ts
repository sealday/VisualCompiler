import {Phase} from "./phase";
/**
 * Created by xiner on 16/5/7.
 */

export class Predictanalyse{
    predictTable = [];
    _phrase=[];
    constructor(){ }

    _predictanalyse(raw_grammar,predictset,input){
        this._phrase=[];
        let predictTableRaw = {hasmatch:"",stack:[],input:[],action:""};

        let stack = [];
        let count =0;
        predictTableRaw.input = input;
        let a = input[count];
        let X = raw_grammar[0].head;
        stack.push("$");
        this._phrase.push(new Phase("将输入指针ip指向缓冲区的第一个符号", {line: 0}));

        stack.push(X);
        this._phrase.push(new Phase("将X设为栈顶符号", {line: 1}));
        predictTableRaw.stack.push("$");
        predictTableRaw.stack.push(X);
        this.predictTable.push(predictTableRaw);
        this._phrase.push(new Phase("", {line: 2}));//while循环那一行
        while (X != "$"){
            let predictTableRawcycle = {hasmatch:"",stack:[],input:[],action:""};

            if(X == a){
                this._phrase.push(new Phase("如果X等于a,执行弹出栈操作", {line: 3}));

                predictTableRawcycle.hasmatch = this.predictTable[this.predictTable.length -1].hasmatch+stack[stack.length-1];
                predictTableRawcycle.action = `匹配 ${stack[stack.length-1]}`;
                stack.pop();
                predictTableRawcycle.stack = angular.copy(stack,predictTableRawcycle.stack);
                if(a != "$"){
                    count = count+1;
                }
                predictTableRawcycle.input = input.slice(count);

                a = input[count];

            }else if(!this._isNonterminal(X)){
                this._phrase.push(new Phase("如果X是终结符,报错", {line: 4}));

                throw new Error("this is a teminal symbol");
            }else{
                this._phrase.push(new Phase("如果M[X,a]=X->Y1 Y2 ...Yk", {line: 5}));

                stack.pop();
                this._phrase.push(new Phase("弹出栈顶符号", {line: 7}));

                let getGenerate = this._getGenerate(predictset,X,a);
                if(getGenerate != "empty"){
                    this._phrase.push(new Phase("将Y1,Y2,Y3...压入栈中,其中Y1位于栈顶", {line: 8}));

                    for(let i = getGenerate.length-1; i >= 0;i--){
                        stack.push(getGenerate[i]);
                    }
                }

                predictTableRawcycle.stack = angular.copy(stack,predictTableRawcycle.stack);
                predictTableRawcycle.input = input.slice(count);

                let outputgen = `${X}->`;
                this._getGenerate(predictset,X,a).forEach((current)=>{
                    outputgen += current;
                });
                predictTableRawcycle.action = `输出 ${outputgen}`;
                    predictTableRawcycle.hasmatch += this.predictTable[this.predictTable.length -1].hasmatch;


            }

            this.predictTable.push(predictTableRawcycle);
            this._phrase.push(new Phase("令X=栈顶符号", {line: 11}));

            X = stack[stack.length -1];

        }
        return this.predictTable;
    }

    /**
     * 判断是否是大小写   以此来表示是终结符还是非终结符
     * @param B
     * @returns {boolean} true是大写
     */
    _isNonterminal(B) {

        for (var b = 0; b < B.length; b++) {
            if (B.match(/[A-Z]/)) {//如果是大写字母的话,就是非终结符
                return true;
            }
        }
        if (B == 'empty') {
            return false;
        }
        return false;
    }

    _getGenerate(predictset,X,a){
        for(let i = 0; i < predictset.length;i ++){
            if(predictset[i].nonterminal == X){

              return  predictset[i].generate[a][0];//这个地方不考虑二义性的问题
            }
        }
    }


    _parseUserinput(userinput){
        let elements = userinput.split(" ");
        elements.push("$");
        return elements;
    }
}