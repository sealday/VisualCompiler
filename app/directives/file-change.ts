export let fileChange = () => {
    return {
        restrict: 'A',
        scope: {
            fileChange: '&'
        },
        link: function (scope, element) {
            element.on('change', onChange);
            scope.$on('destroy', function () {
                element.off('change', onChange);
            });
            function onChange() {
                let reader = new FileReader();
                reader.onload = function (evt) {
                    scope.$apply(function () {
                        scope.fileChange({result: reader.result});
                    });
                };
                reader.readAsText(element[0].files[0]);
            }
        }
    }
};
