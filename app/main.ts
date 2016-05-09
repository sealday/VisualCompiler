import * as angular from "angular";
import {MainController} from "./MainController";
import {fileChange} from "./directives/file-change";
import "angular-animate";

angular
    .module('VisualCompiler', ['ngAnimate'])
    .controller('MainController', MainController)
    .directive('fileChange', fileChange);
