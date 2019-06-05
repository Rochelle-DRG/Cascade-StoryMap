
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
        // esriConfig.defaults.io.corsEnabledServers.push("gis.davey.com");
        esriConfig.defaults.io.corsDetection = false;

        $.each(mapAttributes, function (k, slideMap) {
            // console.log(slideMap); //good
            var currentMap = new Map(slideMap.containerID, {
                basemap: slideMap.basemap,
                center: slideMap.mapCenter,
                zoom: slideMap.zoom
            });

            currentMap.on("load", function(){
                currentMap.disableMapNavigation();
            });

            currentMap.on("mouse-drag-start", function(){
                currentmap.enableMapNavigation();
            });

            currentMap.on('mouse-out', function(){
                currentMap.disableMapNavigation();
            });

            //loop through MapAttributes.featureArray
            $.each(slideMap.featureArray, function (j, layerNumber) {
                //  console.log(layerNumber);
                //  console.log(mapLayers);
                //  console.log(mapLayers[layerNumber]);
                //  console.log(mapLayers[layerNumber].url);
                var slide = mapLayers[layerNumber];
                var newLayer;
                if (slide.type === "raster") {
                    var layer1 = new WMSLayerInfo({
                        name: '1',
                        title: 'Rivers'
                      });
                      var layer2 = new WMSLayerInfo({
                        name: '2',
                        title: 'Cities'
                      });
                      var resourceInfo = {
                        extent: new Extent(-126.40869140625, 31.025390625, -109.66552734375, 41.5283203125, {
                          wkid: 4326
                        }),
                        layerInfos: [layer1, layer2]
                      };
                    //   var wmsLayer = new WMSLayer('https://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer', {
                        var wmsLayer = new WMSLayer('https://gis.davey.com/arcgis/services/Sammamish/SammamishFeatures/MapServer/WMSServer', {
   
                    resourceInfo: resourceInfo,
                        visibleLayers: ['1', '2']
                      });
                      currentMap.addLayers([wmsLayer]);



                    newLayer = new WMSLayer(slide.url,
                        {
                            resourceInfo: resourceInfo,
                            visibleLayers: ['name1', 'name2'] 
                        });
            } //end if raster

            if (slide.type === "feature") {
                newLayer = new FeatureLayer(slide.url)
            }
            currentMap.addLayer(newLayer);
            console.log(currentMap.FeatureLayer);

        }); //end .each layerNumber



    }); //end .each

}); //end require/function
}); //end doc.ready
