export class PredictTable{
    terminalset = [];
    nonterminalset = [];
    predictset = [];
    constructor(){ }
    
    _predicttable(raw_grammar,first_set,follow_set){
    this.predictset =[];

        raw_grammar.forEach((current)=>{
            if(this._isNonterminal(current.head)){
                if(this.nonterminalset.indexOf(current.head)==-1){
                    this.nonterminalset.push(current.head);
                }
            }

           current.body.forEach((currentbody)=>{
               currentbody.forEach((currentbodyper)=>{
                   if(this._isNonterminal(currentbodyper)){//非终结符

                   }else{
                       if(currentbodyper =="empty"){
                           if(this.terminalset.indexOf("$") == -1){
                               this.terminalset.push("$");
                           }
                       }else{
                           if(this.terminalset.indexOf(currentbodyper) == -1){
                               this.terminalset.push(currentbodyper);
                           }
                       }

                   }

               });
           });
        });


        raw_grammar.forEach((current)=>{
            let new_production = {nonterminal:"", generate: []};
            for(let i =0;i<this.terminalset.length;i++){
                new_production.generate[i]=[];
            }



            new_production.nonterminal = current.head;
            current.body.forEach((currentbody)=>{
               // currentbody.forEach((currentbodyper)=>{
                    let currentbodyper = currentbody[0];
                   if(currentbodyper =="empty"){
                       let followset = follow_set[current.head];
                       followset.forEach((followper)=>{
                           new_production.generate[this.terminalset.indexOf(followper)].push(currentbody);

                       });
                   }else{
                       if(this._isNonterminal(currentbodyper)){//非终结符
                           let firstset = first_set[currentbodyper];
                           firstset.forEach((firstper)=>{
                               new_production.generate[this.terminalset.indexOf(firstper)].push(currentbody);

                           });
                       }else{//终结符
                           new_production.generate[this.terminalset.indexOf(currentbodyper)].push(currentbody);
                       }
                   }

               // });
            });

            this.predictset.push(new_production);
        });
        
        return this.predictset;
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

}