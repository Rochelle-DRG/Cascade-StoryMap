
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
        "dojo/_base/array",//this is not a mistake

        "esri/dijit/LayerSwipe",
        "esri/arcgis/utils",
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
        array,

        LayerSwipe,
        arcgisUtils,
        Legend,
        ArcGISDynamicMapServiceLayer,
        ImageParameters) {

            var layersURL = "https://gis.davey.com/arcgis/rest/services/Sammamish/SammamishFeatures/MapServer";

            //dealing with the CORS/wms problem
            // esriConfig.defaults.io.corsEnabledServers.push("gis.davey.com");
            esriConfig.defaults.io.corsDetection = false;

            makeTheLegend = function (slideMap, currentMap) {
                var detailLayer = mapLayers[slideMap.searchLayer].layerID;
                var imageParameters = new ImageParameters();
                imageParameters.layerIds = detailLayer;
                imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW; //defines that you only see the layer(s) listed above
                imageParameters.transparent = true; //the website says "Whether or not background of dynamic image is transparent."
                imageParameters.format = "png32" //this makes the opacity set at the service level actually work (untested outside of chrome)
                //maybe we can just use the featureLayer here
                dynamicMSL = new ArcGISDynamicMapServiceLayer(layersURL, {
                    "imageParameters": imageParameters
                });

                legendDivId = slideMap.containerID + "_legend"; //the same as the div made in main.js
                // console.log("The legend div is "+legendDivId);    
                legendDijit = new Legend({
                    map: currentMap,
                    layerInfos: [{ layer: dynamicMSL }]
                    // }, 'esriLegend'); //end legendDijit new
                }, legendDivId); //end legendDijit new




            }; //end makeTheLegend



            // mapAttributes is the list of individula map details from all of the Slides
            $.each(mapAttributes, function (k, slideMap) {
                // console.log("1.) current map: " + slideMap.containerID); //good
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
                    // console.log("3.) making " + layerNumber + " of " + slideMap.containerID);
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
                    // console.log("4.) end of .each layer");
                }); //end .each layerNumber

                legendDijit.refresh();

                //still inside for-each-mapslide loop
                // console.log(mapLayers[slideMap.searchLayer].layerID); //returns a number
                currentMap.on("click", function (event) {
                    setPopups(event, slideMap, currentMap);
                }); //end on-click
                // console.log("!LAST)end of .each map/slide");
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


// // first swipe example
            // var mapDeferred = arcgisUtils.createMap("62702544d70648e593bc05d65180fd64", "map");
            // mapDeferred.then(function (response) {
            //     var id;
            //     var map = response.map;
            //     var title = "2009 Obesity Rates";
            //     //loop through all the operational layers in the web map 
            //     //to find the one with the specified title;
            //     var layers = response.itemInfo.itemData.operationalLayers;
            //     array.some(layers, function (layer) {
            //         if (layer.title === title) {
            //             id = layer.id;
            //             if (layer.featureCollection && layer.featureCollection.layers.length) {
            //                 id = layer.featureCollection.layers[0].id;
            //             }
            //             return true;
            //         } else {
            //             return false;
            //         }
            //     }); //end array.some
            //     //get the layer from the map using the id and set it as the swipe layer
            //     if (id) {
            //         var swipeLayer = map.getLayer(id);
            //         var swipeWidget = new LayerSwipe({
            //             type: "vertical", //Try switching to "scope" or "horizontal"
            //             map: map,
            //             layers: [swipeLayer]
            //         }, "swipeDiv");
            //         swipeWidget.startup();
            //         console.log([swipeLayer]);
            //     }
            // }); //end mapDeferred.then
            //end 1st swipe example


            // // // //second swipe example
            // mapTest2 = new Map("map", {
            //     basemap: "gray",
            //     center: [-96.5, 38.3],
            //     zoom: 6
            // });
            // var cities = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer");
            // cities.setVisibleLayers([0]);
            // var Hurricanes = new ArcGISDynamicMapServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer");
            // Hurricanes._div = map.root;
            // cities._div = map.root;

            // mapTest2.addLayers([Hurricanes, cities]);

            // var swipeWidget2 = new LayerSwipe({
            //     type: "vertical",  //Try switching to "scope" or "horizontal"  
            //     map: mapTest2,
            //     layers: [Hurricanes]
            // }, "swipeDiv2");

            // swipeWidget2.startup();


// //MY first swipe test
            // mapTestMe = new Map("map", {
            //     basemap: "gray",
            //     center: [-122.035534, 47.616567],
            //     zoom: 13
            // });
            // featureSwipeLayer1 = new FeatureLayer(mapLayers["Layer1"].url);
            // featureSwipeLayer2 = new FeatureLayer(mapLayers["Layer2"].url);

            // mapTestMe.addLayers([featureSwipeLayer1, featureSwipeLayer2]);

            // console.log(mapTestMe);
            // var mySwipeWidget = new LayerSwipe({
            //     type:"vertical",
            //     map: mapTestMe,
            //     layers: featureSwipeLayer1
            // }, "mySwipeTest");
            // mySwipeWidget.startup();



        }); //end require/function

}); //end doc.ready
