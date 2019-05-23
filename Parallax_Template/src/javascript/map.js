$(document).ready(function () {
    require([
        "esri/Map",
        "esri/views/MapView"
    ], function(Map, MapView) {
        var map = new Map({
            basemap: "topo-vector"
        });

        var mapview1 = new MapView({
            container: "viewDiv",
            map: map,
            center: [-73.988015, 40.739561], // NYC
            zoom: 11
        });

        var map2 = new Map({
            basemap: "streets"
        });
        
        var mapview2 = new MapView({
            container: "viewDiv2",
            map: map2,
            center: [-81.693914,41.498157], // CLE
            zoom: 10
        });

        var map3 = new Map({
            basemap: "gray"
        });

        var mapview3 = new MapView({
            container: "viewDiv3",
            map: map3,
            center: [-77.035123,38.889262],
            zoom: 10
        });

        mapview1.on("mouse-wheel", function(event) {
            //disable mouse wheel scroll zooming on the view
            event.stopPropagation();
        });

        mapview2.on("mouse-wheel", function(event) {
            //disable mouse wheel scroll zooming on the view
            event.stopPropagation();
        });

        mapview1.ui.move("zoom", "bottom-left");
        mapview2.ui.move("zoom", "bottom-left");
        mapview3.ui.move("zoom", "bottom-left");

    });
});