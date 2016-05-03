/**
 * Created by xiner on 16/5/3.
 */
class FirstSet{
    constructor(){
        this.first = {};
        this.map = {};
    }

    /**
     * 查找FIRST集合
     */
    _findFirst(raw_grammar) {

        raw_grammar.forEach((current)=>{
            this.map[current.head] = current.body;
        });
        raw_grammar.forEach((current)=>{
           this._firstCore(current.head,current.body);
        });

    console.log("first 集合如下:" + this.first);


    
}

    _firstCore(leftnode, rightnodes) {
    if (leftnode in this.first) {
        return this.first[leftnode];
    }

    var st = [];
        for (var ii = 0; ii < rightnodes.length; ii++) {
            for (var aa = 0; aa < rightnodes[ii].length; aa++) {
                let currentbody = rightnodes[ii][aa];
                if(currentbody in this.map){//非终结点
                    var temst = this._firstCore(currentbody, this.map[currentbody]);
                    st = st.concat(temst);
                    if (temst.indexOf("$") > -1) {

                    } else {
                        break;

                    }
                }else{//终结点
                    st.push(currentbody);
                    break;

                }

            }
        }

        this.first[leftnode] = st;
        return st;
}
}