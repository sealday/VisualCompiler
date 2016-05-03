//noinspection TypeScriptCheckImport
import * as _ from 'lodash';

export class extractFactor {
    new_grammar: any[];
    constructor() { }

    _extract(old_grammar) {
        this.new_grammar = [];
        old_grammar.forEach((current)=> {
            let leftu = current.head;
            this._longestCommonPrefix(current.body, 0, current.head, leftu);//提取左公因子
        });
    }
    
    /**
     * 提取左公因子具体算法
     * @param allgen  每一个的箭头右侧部分
     * @param start  从第几个元素还是匹配前缀
     * @param leftuserri 箭头左边的部分,为了生成 A A' A'' A'''类似的东西
     * @returns {*}
     */
    _longestCommonPrefix(allgen, start, leftuserri, leftu) {
        let next_production = {head: "", body: []};
        var prefix = allgen[start];
        var max = 0;
        for (var i = start + 1; i < allgen.length; i++) {
            var j = 0;
            while (j < allgen[i].length && j < prefix.length && allgen[i][j] == prefix[j]) {
                j++;
            }
            if (j == 0) {//如果这个元素没有公共左因子,就跳过
                continue;
            } else {
                if (max < j) {//如果之前的前缀不如现在这个前缀长,为了找到最长的公共左因子
                    max = j;
                }
            }
        }
        prefix = prefix.slice(0, max);
        if (prefix.length != 0) {
            var reallgen = allgen.slice();//复制数组
            var rightleft = [];
            let new_production = {head: "", body: []};

            for (var de = start; de < allgen.length; de++) {//提取左公因子
                if (_.isEqual(allgen[de].slice(0, prefix.length), prefix)) {//如果allgen[de]以prefix开头
                    reallgen[de] = [];
                    allgen[de] = allgen[de].slice(prefix.length, allgen.length);
                    new_production.body.push(allgen[de]);//为了推出A'的表达式使用的,就是把前缀替换成"",然后剩下的部分单独拿出来
                }else{
                    rightleft.push(reallgen[de]);//提取左公因子之后,剩下的部分要怎么写
                }
            }
            leftuserri = leftuserri + "'";//头部
            let temp = [];
            if (rightleft.length == 0) {
                temp = temp.concat(prefix);
                temp.push(leftuserri);
                next_production.body.push(temp);
            } else {
                temp = temp.concat(prefix);
                temp.push(leftuserri);
                next_production.body.push(temp);
                next_production.body = next_production.body.concat(rightleft);
            }
            new_production.head = leftuserri;
            this.new_grammar.push(new_production);
        } else {
            next_production.body = allgen;
        }

        start = start + 1;
        if (start < next_production.body.length) {
            return this._longestCommonPrefix(next_production.body, start, leftuserri, leftu);//递归查找
        } else {
            next_production.head = leftu;
            this.new_grammar.push(next_production);
            return;
        }
    }

}