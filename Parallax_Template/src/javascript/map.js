
$(document).ready(function () {
    require([
        "esri/map",
        "esri/layers/FeatureLayer",
        "esri/dijit/LayerSwipe",
        "dojo/domReady!"
    ], function (Map, FeatureLayer, LayerSwipe ) {

        $.each(mapAttributes, function(k, FeatureLayer, slideMap) {
            var currentmap = new Map(slideMap.containerID, {
                basemap:slideMap.basemap,
                center: slideMap.mapCenter,
                zoom: slideMap.zoom
            });

            //loop through MapAttributes.featureArray
            $.each(slideMap.featureArray, function(j, layerNumber){
            //                  // console.log(layerNumber);
            //                  // console.log(layerNumber);
            //                  // console.log(mapLayers);
            //                  // console.log(mapLayers[layerNumber]);
            //                   // console.log(mapLayers[layerNumber].url);
                var layerName = new FeatureLayer({
                    url: mapLayers[layerNumber].url,
                })
                currentMap.add(layerName);
                console.log(currentMap.FeatureLayer);
            }); //end .each layerNumber
             


        }); //end .each

    }); //end require/function
}); //end doc.ready
