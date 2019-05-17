$(document).ready(function () {
    require([
        "esri/Map",
        "esri/views/MapView"
    ], function(Map, MapView) {
        var map = new Map({
            basemap: "topo-vector"
        });

        var map2 = new Map({
            basemap: "streets"
        });

        var view = new MapView({
            container: "viewDiv",
            map: map,
            center: [-118.71511,34.09042],
            zoom: 11
        });

        var myotherview = new MapView({
            container: "viewDiv2",
            map: map2,
            center: [-80.78511,41.10042],
            zoom: 10
        });

        view.on("mouse-wheel", function(event) {
            // disable mouse wheel scroll zooming on the view
            event.stopPropagation();
        });

    });
});