
$(document).ready(function () {
    require([
        "esri/map",
        "esri/layers/FeatureLayer",
        "esri/layers/WMSLayer",
        "esri/layers/WMSLayerInfo",
        "esri/geometry/Extent",
        "esri/config",
        "esri/dijit/LayerSwipe",
        "dojo/domReady!"
    ], function (Map, FeatureLayer, WMSLayer, WMSLayerInfo, Extent, esriConfig, LayerSwipe) {

        //dealing with the CORS/wms problem
        esriConfig.defaults.io.corsEnabledServers.push("gis.davey.com");

        $.each(mapAttributes, function (k, slideMap) {
            // console.log(slideMap); //good
            var currentMap = new Map(slideMap.containerID, {
                basemap: slideMap.basemap,
                center: slideMap.mapCenter,
                zoom: slideMap.zoom
            });

            //loop through MapAttributes.featureArray
            $.each(slideMap.featureArray, function (j, layerNumber) {
                //  console.log(layerNumber);
                //  console.log(mapLayers);
                //  console.log(mapLayers[layerNumber]);
                //  console.log(mapLayers[layerNumber].url);
                var layer = mapLayers[layerNumber];
                var newLayer;
                // if (slide.type === "raster") {

                newLayer = new FeatureLayer(layer.url)
                currentMap.addLayer(newLayer);

            }); //end .each slideMap

        }); //end .each mapAttributs

    }); //end require/function
}); //end doc.ready
