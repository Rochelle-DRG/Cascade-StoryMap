
$(document).ready(function () {
    require([
        "esri/Map",
        "esri/views/MapView"
    ], function (Map, MapView) {

        $.each(mapAttributes, function(k, slideMap) {
            var currentmap = new Map({
                basemap:slideMap.basemap,
            });

            var currentview = new MapView({
                container: slideMap.containerID,
                map: currentmap,
                center: slideMap.mapCenter,
                zoom: slideMap.zoom
            });

            currentview.ui.move("zoom", "bottom-right");
            currentview.on("mouse-wheel", function (event) {
                //disable mouse wheel scroll zooming on the view
                event.stopPropagation();
            });
            currentview.on("drag", function (event) {
                //disable panning
                event.stopPropagation();
            });
        }); //end .each

    }); //end require/function
}); //end doc.ready
