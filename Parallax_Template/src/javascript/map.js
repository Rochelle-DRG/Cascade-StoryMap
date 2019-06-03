
$(document).ready(function () {
    require([
        "esri/map",
        "esri/dijit/LayerSwipe"
    ], function (Map, LayerSwipe) {

        $.each(mapAttributes, function(k, slideMap) {
            var currentmap = new Map(slideMap.containerID, {
                basemap:slideMap.basemap,
                center: slideMap.mapCenter,
                zoom: slideMap.zoom
            });

        }); //end .each

    }); //end require/function
}); //end doc.ready
