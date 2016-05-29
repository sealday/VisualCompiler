import * as d3 from "d3";

export class LexicalController {

	// 词法单元例子
	raw_sentences: string;
	sentences: any;
	token_tests: any;


	// 输入缓冲例子
	bufferString: string;
	charArray: any;


	constructor($scope) {
		this.inputBuffer();
		this.raw_sentences = `if else pi score d3 3d "what" "some" <= >=  "sdfsdf sdfsdf"`;
		this.bufferString = "E = M * C * * 2";
		this._initTokenTests();

		$scope.$watch(() => this.raw_sentences, () => {
			this.sentences = this.getSentences(this.raw_sentences);
			console.log("hello vm");
		});
	}

	_initTokenTests() {
		this.token_tests = {
			if: w => /^if$/.test(w) ? { n: "if", w } : false,
			else: w => /^else$/.test(w) ? { n: "else", w} : false,
			comparison: w => /^(<|>|<=|>=|==|!=)$/.test(w) ? { n: "comparison", w } : false,
			id: w => /^[a-zA-Z]([a-zA-Z]|\d)*$/.test(w) ? { n: "id", w } : false,
			number: w => /^(\+|-)?\d+(\.\d+)?$/.test(w) ? { n: "number", w } : false,
			literal: w => /^"[^"]*"$/.test(w) ? { n: "literal", w } : false
		}
	}

	_split(str: string) {
		let temp = "";
		let result = [];
		let quote = false;
		for (let i = 0; i < str.length; i++) {
			if (quote) {
				temp += str[i];
				if (str[i] === '"') {
					quote = false;
				}
			} else if (/[\t ]/.test(str[i])) {
				result.push(str[i]);
				if (temp !== "") {
					result.push(temp);
					temp = "";
				}
			} else if (str[i] === '"') {
				quote = true;
				temp = str[i];
			} else {
				temp += str[i];
			}
		}
		if (temp !== "") {
			result.push(temp);
		}
		return result;
	}

	getSentences(raw_sentences: string) {
		let sentences = raw_sentences.split("\n");
		let my_sentences = [];
		sentences.forEach(s => {
			let some = [];
			let words = this._split(s);
			words.forEach(w => {
				let html = false;
				for (let i in this.token_tests) {
					html = this.token_tests[i](w);
					if (html) break;
				}
				if (html) {
					some.push(html); 
				} else {
					some.push({ n: w, w, ns: true});
				}
			});
			my_sentences.push(some);
		});
		return my_sentences;
	}

	// 转换空格为适当的内容
	decode() {
		return "token-space";
	}

	spliteBuffer() {
		this.charArray = this.bufferString.split("");
	}

	inputBuffer() {
		const w = 800;
		const h = 200;
		// border
		const b = 38;
		let svg = d3.select("#input-buffer").append("svg").attr({
			width: w,
			height: h
		});

		// 上下两条边界
		for (let i = 0; i < 2; i++) {
			svg.append("line")
				.attr({
					x1: 0,
					y1: (h - b) / 2 + b * i,
					x2: w,
					y2: (h - b) / 2 + b * i
				})
				.style({
					stroke: "black"
				});
		}

		// 作为示例的缓冲区
		let buffer: [any] = [
			{"id":0,"content":" ","flag":""},
			{"id":1,"content":" ","flag":""},
			{"id":2,"content":" ","flag":""},
			{"id":3,"content":" ","flag":""},
			{"id":4,"content":"E","flag":""},
			{"id":5,"content":" ","flag":""},
			{"id":6,"content":"=","flag":""},
			{"id":7,"content":" ","flag":""},
			{"id":8,"content":"M","flag":""},
			{"id":9,"content":"*","flag":""},
			{"id":10,"content":"C","flag":""},
			{"id":11,"content":"*","flag":"lexemeBegin"},
			{"id":12,"content":"*","flag":""},
			{"id":13,"content":"2","flag":"forward"},
			{"id":14,"content":"$","flag":""},
			{"id":15,"content":" ","flag":""},
			{"id":16,"content":" ","flag":""},
			{"id":17,"content":" ","flag":""},
			{"id":18,"content":" ","flag":""},
			{"id":19,"content":" ","flag":""},
			{"id":20,"content":"$","flag":""}
		];

		// 绑定class为node的所有g
		let node = svg.selectAll("g.node").data(buffer, d => d.id);
		let node_append = node
			// 当新的节点加入的时候
			.enter()
			.append("g")
			.attr({
				class: "node",
				transform: (d, i) => `translate(${i * b + b / 2}, ${h / 2})`
			});

		// 对于每一个节点，里面存有一个圆和字
		node_append.append("circle").attr({
			r: b / 2,
			stroke: "black",
			fill: "none"
		});

		node_append.append("text")
			.text(d => d.content)
			.style({
				"font-size": "24px"
			})
			.attr({
				// 水平居中文字
				"text-anchor": "middle",
				// 下沉 0.35 倍字体大小可以让字垂直居中
				dy: ".35em"
			});

		// 用来标明指针所在的位置
		node_append.append("rect")
			.attr({
				x: -b / 2,
				y: -b / 2,
				width: b,
				height: b,
				fill: "none",
				stroke: d => {
					switch (d.flag) {
						case "lexemeBegin":
							return "#e6db74";
						case "forward":
							return "darkblue";
						default:
							return "none"
					}
				},
				"stroke-width": d => {
					return d.flag === "" ? 1 : 4;
				}
			})


	}

}