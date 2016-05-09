/**
 * Created by xiner on 16/5/7.
 */

export class Predictanalyse{
    input = ["i","+","i", "*" ,"i","$"];
    predictTable = [];
    constructor(){ }

    _predictanalyse(raw_grammar,predictset){
        let predictTableRaw = {hasmatch:"",stack:[],input:[],action:""};

        let stack = [];
        let count =0;
        predictTableRaw.input = this.input;
        let a = this.input[count];
        let X = raw_grammar[0].head;
        stack.push("$");
        stack.push(X);
        predictTableRaw.stack.push("$");
        predictTableRaw.stack.push(X);
        this.predictTable.push(predictTableRaw);
        while (X != "$"){
            let predictTableRawcycle = {hasmatch:"",stack:[],input:[],action:""};

            if(X == a){
                predictTableRawcycle.hasmatch = this.predictTable[this.predictTable.length -1].hasmatch+stack[stack.length-1];
                predictTableRawcycle.action = `匹配 ${stack[stack.length-1]}`;
                stack.pop();
                predictTableRawcycle.stack = angular.copy(stack,predictTableRawcycle.stack);
                if(a != "$"){
                    count = count+1;
                }
                predictTableRawcycle.input = this.input.slice(count);

                a = this.input[count];

            }else if(!this._isNonterminal(X)){
                throw new Error("this is a teminal symbol");
            }else{
                stack.pop();
                let getGenerate = this._getGenerate(predictset,X,a);
                if(getGenerate != "empty"){
                    for(let i = getGenerate.length-1; i >= 0;i--){
                        stack.push(getGenerate[i]);
                    }
                }

                predictTableRawcycle.stack = angular.copy(stack,predictTableRawcycle.stack);
                predictTableRawcycle.input = this.input.slice(count);

                let outputgen = `${X}->`;
                this._getGenerate(predictset,X,a).forEach((current)=>{
                    outputgen += current;
                });
                predictTableRawcycle.action = `输出 ${outputgen}`;
                    predictTableRawcycle.hasmatch += this.predictTable[this.predictTable.length -1].hasmatch;


            }

            this.predictTable.push(predictTableRawcycle);
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
}