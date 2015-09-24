'use strict';   

angular.module("tcApp2App")
    .directive("vgSegment",
    function vgSegment() {
        return {
            scope: {
                vgDataProvider: "=",
                vgLang: "="
            },
            templateUrl: "app/shared/vtranscript/vg-segment.html"
        };
    }
);

