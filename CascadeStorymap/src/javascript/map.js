
$(document).ready(function () {
    require([
        "esri/map",
        "esri/layers/FeatureLayer",
        "esri/layers/WMSLayer",
        "esri/layers/WMSLayerInfo",
        "esri/geometry/Extent",
        "esri/config",
        "esri/tasks/IdentifyTask",
        "esri/tasks/IdentifyParameters",
        "esri/InfoTemplate",
        "esri/dijit/Popup",
        "esri/dijit/PopupTemplate",
        "dojo/_base/array",

        "esri/dijit/LayerSwipe",

        "dojo/domReady!"
    ], function (Map,
        FeatureLayer,
        WMSLayer,
        WMSLayerInfo,
        Extent,
        esriConfig,
        IdentifyTask,
        IdentifyParameters,
        InfoTemplate,

        Popup,
        PopupTemplate,
        arrayUtils,
        LayerSwipe) {

            //dealing with the CORS/wms problem
            // esriConfig.defaults.io.corsEnabledServers.push("gis.davey.com");
            esriConfig.defaults.io.corsDetection = false;

            // mapAttributes is the list of mapsAttributes from all of the Slides
            $.each(mapAttributes, function (k, slideMap) {
                // console.log(slideMap); //good
                var currentMap = new Map(slideMap.containerID, {
                    basemap: slideMap.basemap,
                    center: slideMap.mapCenter,
                    zoom: slideMap.zoom,
                }); //end var currentMap= new Map
                // other enable/disables here: https://developers.arcgis.com/javascript/3/jshelp/intro_navigation.html
                currentMap.on("load", function(){
                    currentMap.disableScrollWheel();
                });

                //loop through MapAttributes.featureArray (featureArray is a list of the layer #'s for the slide)
                $.each(slideMap.featureArray, function (j, layerNumber) {
                    var slide = mapLayers[layerNumber];
                    var newLayer;

                    if (slide.type === "raster") {
                        console.log(layerNumber + " is a raster layer");
                    } //end if raster

                    if (slide.type === "feature") {

                        var feature = slide;
                        // console.log(slide);



                        newLayer = new FeatureLayer(slide.url)
                    }
                    currentMap.addLayer(newLayer);
                }); //end .each layerNumber

                //still inside for-each-mapslide loop
                // console.log(mapLayers[slideMap.searchLayer].layerID); //returns a number
                currentMap.on("click", function (event) {
                    var popupLayer = mapLayers[slideMap.searchLayer];
                    // console.log(popupLayer);

                    identifyTask = new IdentifyTask("https://gis.davey.com/arcgis/rest/services/Sammamish/SammamishFeatures/MapServer");

                    identifyParams = new IdentifyParameters();
                    identifyParams.tolerance = 10; //i think the bigger the number the bigger the area around your click it searches.
                    identifyParams.returnGeometry = true;
                    identifyParams.layerIds = popupLayer.layerID; //this can be multiple layers, but we're just using one right now
                    identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
                    identifyParams.width = currentMap.width;
                    identifyParams.height = currentMap.height;
                    identifyParams.geometry = event.mapPoint;
                    identifyParams.mapExtent = currentMap.extent;
                    // console.log(identifyParams); //working
                    var deferred = identifyTask
                        .execute(identifyParams)
                        .addCallback(function (response) {
                            //skipping the if (response.length > 0)
                            console.log(currentMap);//currentMap.basemapLayerID 
                            console.log(currentMap.basemapLayerID);                     //undefined
                            // console.log(currentMap.infoWindow.featureLayers);        // undefined
                            console.log(currentMap.layerIds);                        // currentMap.layerIds ["layer0"]I think this is actually returning the slide?
                            console.log(response); //THIS CODE IS BEING REACHED BUT THE RESPONSE IS EMPTY sometimes
                            // response should include layerID, layerName, displayFieldName, value, geomtryType....

                            if (response.length > 0) {//if there should be a popup
                                return arrayUtils.map(response, function (result) {
                                    console.log("this code is being executed"); 
                                    var feature = result.feature;
                                    var layerName = result.layerName;
                                    feature.attributes.layerName = layerName;
                                    //temporary hard-code
                                    var popupTemplate = new InfoTemplate(popupLayer.title, popupLayer.popupContent);
                                    feature.setInfoTemplate(popupTemplate);
                                    currentMap.infoWindow.show(event.mapPoint);
                                    return feature;

                                }); //end return arrayUtils
                            } //end if response.length
                            else { if (map.infoWindow) { map.infoWindow.hide(); } };
                        }); //end .addCalback
                    currentMap.infoWindow.setFeatures([deferred]);

                }); //end on-click



            }); //end .each

        }); //end require/function
}); //end doc.ready
