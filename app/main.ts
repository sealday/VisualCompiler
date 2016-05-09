import * as angular from "angular";
import {MainController} from "./MainController";
import {fileChange} from "./directives/file-change";
import * as d3 from "d3";
import "angular-animate";

angular
    .module('VisualCompiler', ['ngAnimate'])
    .controller('MainController', MainController)
    .directive('fileChange', fileChange);

let pre = d3.select("pre#phase");
let director =
    `状态 0 入栈;
把下一个输入符号读入 a 中;
DO
    把栈顶元素读进 Sm 中;
    IF ACTION[Sm, a] = 移进
        s = GOTO[Sm, a];
        s 压栈;
        读入下一个符号;
    ELSE IF ACTION[Sm, a] = 归约;
        按 ACTION[Sm, a] 的产生式 A → β 归约
        |β| 个状态出栈;
        GOTO [Sm - r, A] 入栈;
    ELSE IF ACTION[Sm, a] = 接受
        分析成功;
    ELSE
        报告错误;
WHILE TRUE`
        .split("\n");

let span = pre.selectAll("span").data(director);

span.enter()
    .append("span")
    .attr("class", (d, i) => `line${i}`);
span.text(d => `${d}\n`);
