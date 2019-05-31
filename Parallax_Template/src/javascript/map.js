// varFromMapJS = "hello world";
// makeAMap = function (mapBasemap) {
// };
// makeAView = function (mapContainer, theMap, mapCenter, mapZoom) {
// };

$(document).ready(function () {
// loadTheMapController = function(){
    console.log("-- Page loaded, adding the maps");
    // console.log(makeAMap);
    require([
        "esri/Map",
        "esri/views/MapView"
    ], function (Map, MapView) {

        $.each(mapMaps, function(k, mapattribute) {
            var currentmap = new Map({
                basemap:mapattribute.basemap,
            });

            // console.log(" -- adding the map view to div")
            var currentview = new MapView({
                container: mapattribute.container,
                map: currentmap,
                center: mapattribute.mapCenter,
                zoom: mapattribute.zoom
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
        });

    });
}); //end doc.ready
