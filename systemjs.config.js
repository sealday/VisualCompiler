//noinspection ThisExpressionReferencesGlobalObjectJS
(function(global) {

    // map tells the System loader where to look for things
    var map = {
        'd3': 'node_modules/d3',
        'angular': 'node_modules/angular',
        'lodash': 'node_modules/lodash',
        'angular-animate': 'node_modules/angular-animate',
        'angular-sanitize': 'node_modules/angular-sanitize',
        'angular-ui-bootstrap': 'node_modules/angular-ui-bootstrap',
        'ui.router': 'node_modules/angular-ui-router',
        'jquery': 'node_modules/jquery',
        'bootstrap': 'node_modules/bootstrap',
        'dist': 'dist' // 'dist',
        
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'dist': { main: 'main.js',  defaultExtension: 'js' },
        'd3': { main: 'd3.js',  defaultExtension: 'js' },
        'angular': { main: 'index.js',  defaultExtension: 'js' },
        'angular-animate': { main: 'index.js',  defaultExtension: 'js' },
        'angular-sanitize': { main: 'index.js',  defaultExtension: 'js' },
        'angular-ui-bootstrap': { main: 'index.js',  defaultExtension: 'js' },
        'lodash': { main: 'index.js',  defaultExtension: 'js' },
        'jquery': { main: 'dist/jquery.min.js',  defaultExtension: 'js' },
        'bootstrap': { main: 'dist/js/bootstrap.min.js',  defaultExtension: 'js' },
        'ui.router': { main: 'release/angular-ui-router.min.js', defaultExtension: 'js'}
    };
    var config = {
        map: map,
        packages: packages
    };

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) { 
        global.filterSystemConfig(config); 
    }

    System.config(config);

})(this);