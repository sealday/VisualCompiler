import "jquery";
import "bootstrap";

// 搞不懂为什么引入 jquery 会导致 angular 找不到模块
// delete window['$'];
// delete window['jQuery'];

import "angular";
import "angular-animate";
import "ui.router";
import { MainController } from "./grammar/main_controller";
import { fileChange } from "./directives/file-change";



angular
    .module('VisualCompiler', ['ngAnimate', 'ui.router'])
    .directive('fileChange', fileChange)
    .config(($stateProvider, $urlRouterProvider, $locationProvider) => {
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

		// 在路径的 # 前面加个 ! 作为提示和传统的 # 作用不一样
		$locationProvider.hashPrefix('!');
    });


angular.bootstrap("body", ["VisualCompiler"]);