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
        let followset = new FollowSet();
        followset._findFollow(raw_grammar,this.first);

    
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

class FollowSet{
    constructor(){

    }


    /**
     * 计算follow的值
     * @param first  first集合
     */
    _findFollow(userinput,first) {
        var keys = Object.keys(first);
        var follow_set = {};
        var A, RHS, B;
        var change = true;
        for (var fnum = 0; fnum < keys.length; fnum++) {//初始化  把follow集合的key写上去
            follow_set[keys[fnum]] = [];
        }

        follow_set[userinput[0].head].push("empty");


    while (change){
        change = false;

        userinput.forEach((current)=>{
           A = current.head;
            RHS = current.body;

            RHS.forEach((currentbody)=>{
                for(let i = 0;i<currentbody.length;i++) {
                    B = currentbody[i];
                    if (this._isNonterminal(B)) {//如果是非终结符的话
                        var beta = [];
                        if(i+1 < currentbody.length){
                            beta = beta.concat(currentbody.slice(i+1));

                        }
                        var rfirst = this._compute_first(beta, first);

                        var size = follow_set[B].length;
                        var Barr = follow_set[B];
                        if (rfirst.indexOf("empty") == -1) {
                            for (var rr = 0; rr < rfirst.length; rr++) {
                                if (Barr.indexOf(rfirst[rr]) == -1) {
                                    Barr.push(rfirst[rr]);

                                }
                            }
                        } else {
                            rfirst.splice(rfirst.indexOf("empty"), 1);
                            for (var rr = 0; rr < rfirst.length; rr++) {
                                if (Barr.indexOf(rfirst[rr]) == -1) {
                                    Barr.push(rfirst[rr]);
                                }
                            }
                            rfirst = follow_set[A];
                            for (var rr = 0; rr < rfirst.length; rr++) {
                                if (Barr.indexOf(rfirst[rr]) == -1) {
                                    Barr.push(rfirst[rr]);
                                }
                            }
                        }


                        var newsize = follow_set[B].length;
                        if (size != newsize) {
                            change = true;
                        }

                    }
                }
            });

        });


    }
        console.log("follow" + follow_set);

}



    /**
     * 取得元素的first集合,如果是终结符的话,就是本身,如果是非终结符的话,就是从set里面拿
     * @param first
     * @param beta
     * @param rnum
     * @returns {*}
     */
    _firstsetwhenterminate(first, beta, rnum) {
    if (!this._isNonterminal(beta[rnum])) {//如果是终结符的话
        return beta[rnum];
    } else {
        return first[beta[rnum]];
    }
}


    _compute_first(beta, first) {
    var result = [];
    if (beta.length == 0 || beta[0] == "empty") {
        result.push("empty");
    } else {
        result.splice(0, result.length);
        var firlen = this._firstsetwhenterminate(first, beta, 0);
        for (var fifi = 0; fifi < firlen.length; fifi++) {
            result.push(firlen[fifi]);
        }
        for (var rnum = 1; rnum < beta.length; rnum++) {
            var fi = this._firstsetwhenterminate(first, beta, rnum - 1);
            if (fi.indexOf("empty") == -1) {
                break;
            }
            var f = this._firstsetwhenterminate(first, beta, rnum);
            f.splice(f.indexOf("empty"), 1);
            for (var fnum = 0; fnum < f.length; fnum++) {
                result.push(f[fnum]);

            }
        }

        var firse = this._firstsetwhenterminate(first, beta, rnum - 1);

        if (rnum == beta.length && firse.indexOf("empty") > -1) {
            if (result.indexOf("empty") == -1) {
                result.push("empty");
            }
        } else {
            if (result.indexOf("empty") > -1) {
                result.splice(result.indexOf("empty"), 1);
            }
        }
    }

    return result;
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