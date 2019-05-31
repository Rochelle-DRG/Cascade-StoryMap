
$(document).ready(function () {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer"
    ], function (Map, MapView, FeatureLayer) {

        
        $.each(mapAttributes, function(k, slideMap) {
            var currentMap = new Map({
                basemap:slideMap.basemap,
            });

            var currentView = new MapView({
                container: slideMap.containerID,
                map: currentMap,
                center: slideMap.mapCenter,
                zoom: slideMap.zoom
            });

            //This is so close to working but it's 4.11 and I need to change the site to 3.28 before continueing
            //loop through MapAttributes.featureArray
            // $.each(slideMap.featureArray, function(j, layerNumber){
            //                  // console.log(layerNumber);
            //                  // console.log(layerNumber);
            //                  // console.log(mapLayers);
            //                  // console.log(mapLayers[layerNumber]);
            //                   // console.log(mapLayers[layerNumber].url);
            //     var layerName = new FeatureLayer({
            //         url: mapLayers[layerNumber].url,
            //     })
            //     currentMap.add(layerName);
            //     console.log(currentMap.FeatureLayer);
            // }); //end .each layerNumber
                


            currentView.ui.move("zoom", "bottom-right");
            currentView.on("mouse-wheel", function (event) {
                //disable mouse wheel scroll zooming on the view
                event.stopPropagation();
            });
            currentView.on("drag", function (event) {
                //disable panning
                event.stopPropagation();
            });



        }); //end .each slideMap

    }); //end require/function
}); //end doc.ready
