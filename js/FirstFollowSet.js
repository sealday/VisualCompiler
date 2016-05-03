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



    // var userinput = ["S->ABc","A->a|$","B->b"];
    var userinput = ["E->TE'",
        "E'->+TE'|ε",
        "T->FT'",
        "T'->*FT'|ε",
        "F->(E)|i"
    ];

    // var userinput = ["A->BaAb",
    //    "B->l",
    //     "C->eA",
    // ];


        // raw_grammar.forEach((current)=>{
        //    map[current.head] = current.body;
        // });
    for (var i = 0; i < userinput.length; i++) {
        var split1 = userinput[i].split("->");
        var split2 = split1[1].split("|");
        this.map[split1[0]] = split2;
    }
    Object.size = function (map) {
        var size = 0, key;
        for (key in map) {
            if (map.hasOwnProperty(key))
                size++;
        }
        return size;
    };

        // raw_grammar.forEach((current)=>{
        //     this.map[current.head] = current.body;
        //    this._firstCore(current.head,current.body);
        // });
    // for (var b = 0; b < Object.size(this.map); b++) {
    //     this._firstCore(Object.keys(this.map)[b], this.map[Object.keys(this.map)[b]]);
    // }


    console.log("first 集合如下:" + this.first);

    // var keyset = Object.keys(this.first);
    // for (var kn = 0; kn < keyset.length; kn++) {
    //     var valueset = this.first[keyset[kn]];
    //     home.firstinput += keyset[kn] + ":{";
    //     for (var vn = 0; vn < valueset.length; vn++) {
    //         home.firstinput += valueset[vn] + ",";
    //     }
    //     home.firstinput += "}\n";
    // }
    //
    // home.firstinput += "follow集合:\n";

    // findFollow(userinput, first);

    
}

    _firstCore(leftnode, rightnodes) {
    if (leftnode in this.first) {
        return this.first[leftnode];
    }

    // var st = [];
    //     for (var ii = 0; ii < rightnodes.length; ii++) {
    //         for (var aa = 0; aa < rightnodes[ii].length; aa++) {
    //             let currentbody = rightnodes[ii][aa];
    //             if(currentbody in this.map){//非终结点
    //                 var temst = this._firstCore(currentbody, this.map[currentbody]);
    //                 st.concat(temst);
    //                 if (temst.indexOf("$") > -1) {
    //
    //                 } else {
    //                     break;
    //
    //                 }
    //             }else{//终结点
    //                 st.push(currentbody);
    //
    //             }
    //
    //         }
    //     }
    //
    //     this.first[leftnode] = st;
    //     return st;

    for (var ii = 0; ii < rightnodes.length; ii++) {
        for (var aa = 0; aa < rightnodes[ii].length; aa++) {
            var nextnode = rightnodes[ii].charAt(aa);
            if (nextnode in this.map) {//非终结点
    
                if (aa + 1 < rightnodes[ii].length && rightnodes[ii].charAt(aa + 1) == '\'') {
                    nextnode += rightnodes[ii].charAt(aa + 1);
                    ++aa;
                }

                if (nextnode in this.map) {
                    var temst = this._firstCore(nextnode, this.map[nextnode]);
                    st = st.concat(temst);
                    if (temst.indexOf("$") > -1) {

                    } else {
                        break;

                    }
                }


            } else {//终结点
                st.push(nextnode.charAt(0));
                break;
            }
        }
    }

    first[leftnode] = st;
    return st;
}
}