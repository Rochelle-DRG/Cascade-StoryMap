
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
        "esri/dijit/Legend",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ImageParameters",

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

        LayerSwipe,
        Legend,
        ArcGISDynamicMapServiceLayer,
        ImageParameters) {

            var layersURL = "https://gis.davey.com/arcgis/rest/services/Sammamish/SammamishFeatures/MapServer";

            //dealing with the CORS/wms problem
            // esriConfig.defaults.io.corsEnabledServers.push("gis.davey.com");
            esriConfig.defaults.io.corsDetection = false;

            makeTheLegend = function (slideMap, currentMap) {
                console.log("2.) makeTheLegend called");
                var detailLayer = mapLayers[slideMap.searchLayer].layerID;
                var imageParameters = new ImageParameters();
                imageParameters.layerIds = detailLayer;
                imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW; //defines that you only see the layer(s) listed above
                imageParameters.transparent = true; //the website says "Whether or not background of dynamic image is transparent."
                imageParameters.format = "png32" //this makes the opacity set at the service level actually work (untested outside of chrome)
                console.log("A");
                //maybe we can just use the featureLayer here
                dynamicMSL = new ArcGISDynamicMapServiceLayer(layersURL,{ 
                    "imageParameters": imageParameters 
                });
                console.log("B");

                legendDivId = slideMap.containerID + "_legend"; //the same as the div made in main.js
                console.log("C");    
                legendDijit = new Legend({
                    map: currentMap,
                    layerInfos: [{ layer: dynamicMSL }]
                }, 'esriLegend'); //end legendDijit new
                console.log("D");

            }; //end makeTheLegend



            // mapAttributes is the list of individula map details from all of the Slides
            $.each(mapAttributes, function (k, slideMap) {
                console.log("1.) current map: " + slideMap.containerID); //good
                var currentMap = new Map(slideMap.containerID, {
                    basemap: slideMap.basemap,
                    center: slideMap.mapCenter,
                    zoom: slideMap.zoom,
                }); //end var currentMap= new Map
                // other enable/disables here: https://developers.arcgis.com/javascript/3/jshelp/intro_navigation.html
                currentMap.on("load", function () {
                    currentMap.disableScrollWheel();
                });
                makeTheLegend(slideMap, currentMap);

                //loop through MapAttributes.featureArray (featureArray is a list of the layer #'s for the slide)
                $.each(slideMap.featureArray, function (j, layerNumber) {
                    console.log("3.) making " + layerNumber + " of " + slideMap.containerID);
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
                    console.log("4.) end of .each layer");
                }); //end .each layerNumber

                legendDijit.refresh();

                //still inside for-each-mapslide loop
                // console.log(mapLayers[slideMap.searchLayer].layerID); //returns a number
                currentMap.on("click", function (event) {
                    setPopups(event, slideMap, currentMap);
                }); //end on-click
                console.log("!LAST)end of .each map/slide");
            }); //end .each


            setPopups = function (event, slideMap, currentMap) {
                var popupLayer = mapLayers[slideMap.searchLayer];
                // console.log(popupLayer);
                identifyTask = new IdentifyTask(layersURL);
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
                        // //skipping the if (response.length > 0)
                        // console.log(currentMap);//currentMap.basemapLayerID 
                        // console.log(currentMap.basemapLayerID);                     //undefined
                        // // console.log(currentMap.infoWindow.featureLayers);        // undefined
                        // console.log(currentMap.layerIds);                        // currentMap.layerIds ["layer0"]I think this is actually returning the slide?
                        // console.log(response); //THIS CODE IS BEING REACHED BUT THE RESPONSE IS EMPTY sometimes
                        // response should include layerID, layerName, displayFieldName, value, geomtryType....

                        if (response.length > 0) {//if there should be a popup
                            return arrayUtils.map(response, function (result) {
                                // console.log("this code is being executed"); 
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
            }; //end setPopups()




        }); //end require/function

}); //end doc.ready
