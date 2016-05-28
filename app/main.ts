import "jquery";
import "bootstrap";

// 搞不懂为什么引入 jquery 会导致 angular 找不到模块
delete window['$'];
delete window['jQuery'];

import * as angular from "angular";
import { MainController } from "./grammar/main_controller";
import { fileChange } from "./directives/file-change";
import "angular-animate";
import "ui.router";



angular
    .module('VisualCompiler', ['ngAnimate', 'ui.router'])
    .directive('fileChange', fileChange)
    .config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			// 语法分析页面
			.state('grammar', {
				url: '/grammar',
				templateUrl: '/app/grammar/index.html',
				controller: MainController,
				controllerAs: 'main'
			})
			// 词法分析页面
			.state('lexical', {
				url: '/lexical',
				templateUrl: '/app/lexical/index.html'
			})
			// 首页，用于介绍这个系统的情况
			.state('home', {
				url: '/home',
				templateUrl: '/app/home/index.html'
			});

		// 默认路径设置为 home
		$urlRouterProvider.otherwise('/home');

    });
