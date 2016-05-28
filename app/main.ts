// import "jquery";
import * as angular from "angular";
import { MainController } from "./MainController";
import { fileChange } from "./directives/file-change";
import "angular-animate";
import "ui.router";

angular
    .module('VisualCompiler', ['ngAnimate', 'ui.router'])
    .directive('fileChange', fileChange)
    .config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('grammar', {
				url: '/grammar',
				templateUrl: '/app/grammar/index.html',
				controller: MainController,
				controllerAs: 'main'
			})
			.state('home', {
				url: '/home',
				templateUrl: '/app/home/index.html'
			});

		// 默认路径设置为 home
		$urlRouterProvider.otherwise('/home');

    });
