
$(document).ready(function () {
    require([
        "esri/map",                     //1
        "esri/layers/FeatureLayer",     //2
        "esri/layers/WMSLayer",         //3
        "esri/layers/WMSLayerInfo",     //4
        "esri/config",                  //5
        "esri/geometry/Extent",         //6
        "esri/config",                  //7
        "esri/tasks/IdentifyTask",      //8
        "esri/tasks/IdentifyParameters",//9
        "esri/InfoTemplate",            //10
        "esri/dijit/Popup",             //11
        "esri/dijit/PopupTemplate",     //12
        "dojo/_base/array",             //13
        "dojo/_base/array",             //14 this "duplicate" is not a mistake


        "esri/dijit/LayerSwipe",        //15
        "esri/arcgis/utils",            //16
        "esri/dijit/Legend",            //17
        "esri/layers/ArcGISDynamicMapServiceLayer",//18
        "esri/layers/ImageParameters",  //19
        "dojo/dom-construct",           //20
        "dojo/dom",                     //21
        "dojo/parser",                  //22


        "dijit/layout/BorderContainer", //always last, no function match
        "dijit/layout/ContentPane",     //always last, no function match
        "dojo/domReady!"                //always last, no function match

    ], function (Map,                   //1
        FeatureLayer,                   //2
        WMSLayer,                       //3
        WMSLayerInfo,                   //4
        esriConfig,                     //5
        Extent,                         //6
        esriConfig,                     //7
        IdentifyTask,                   //8
        IdentifyParameters,             //9
        InfoTemplate,                   //10

        Popup,                          //11
        PopupTemplate,                  //12
        arrayUtils,                     //13
        array,                          //14

        LayerSwipe,                     //15
        arcgisUtils,                    //16
        Legend,                         //17
        ArcGISDynamicMapServiceLayer,   //18
        ImageParameters,                //19
        domConst,                       //20
        dom,                            //21
        parser) {                       //22

            dojo.require("esri.tasks.query"); //part of 1st attempt setGeoPopups https://developers.arcgis.com/javascript/3/jssamples/query_clickinfowindow.html

            var layersURL = "https://gis.davey.com/arcgis/rest/services/BloomingtonIN/BloomintonIN/MapServer";
            var isTouchScreen;

            function isTouchDevice() { return 'ontouchstart' in document.documentElement; }
            if (isTouchDevice()) {  /*on mobile*/ isTouchScreen = true; }
            else { /*on desktop*/ isTouchScreen = false; };
            console.log(isTouchScreen);

            //dealing with the CORS/wms problem
            // esriConfig.defaults.io.corsEnabledServers.push("gis.davey.com");
            esriConfig.defaults.io.corsDetection = false;


            // // //second swipe example
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

            // // // my bloomington swipe hard-coded example
            // mapTest2 = new Map("map", {
            //     basemap: "topo",
            //     center: [-86.522406, 39.167872 ],
            //     zoom: 13
            // });
            // var parksLayer = mapLayers["Layer5"].url;
            // var waterLayer = mapLayers["Layer6"].url;

            // mapTest2.addLayer(parksLayer);

            // var swipeWidget2 = new LayerSwipe({
            //     type: "vertical",  //Try switching to "scope" or "horizontal"  
            //     map: mapTest2,
            //     layers: ["Layer5"]
            // }, "swipeDiv2");

            // swipeWidget2.startup();




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
            //         console.log(swipeWidget);
            //     }
            // }); //end mapDeferred.then
            // //end 1st swipe example








            setPopups = function (event, slideMap, currentMap) {
                console.log("setPopups has been called");
                var popupLayer = mapLayers[slideMap.searchLayer];
                identifyTask = new IdentifyTask(popupLayer.infoUrl);
                identifyParams = new IdentifyParameters();
                identifyParams.tolerance = 10; //i think the bigger the number the bigger the area around your click it searches.
                identifyParams.returnGeometry = true;
                identifyParams.layerIds = popupLayer.layerID; //this can be multiple layers, but we're just using one right now
                identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
                identifyParams.width = currentMap.width;
                identifyParams.height = currentMap.height;
                identifyParams.geometry = event.mapPoint;
                identifyParams.mapExtent = currentMap.extent;
                console.log(identifyParams); //working
                var deferred = identifyTask
                    .execute(identifyParams)
                    .addCallback(function (response) {

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
                        else {
                            if (map.infoWindow) {
                                console.log("execute(identifyParams) returned nothing");
                                setGeoPopups(event, slideMap, currentMap);
                                // map.infoWindow.hide(); 
                            }
                        }; //end else nothing returned
                    }); //end .addCalback
                currentMap.infoWindow.setFeatures([deferred]);
            }; //end setPopups()



            makeTheLegend = function (mapDetailsFromJson, currentMap) {
                var detailLayer = mapLayers[mapDetailsFromJson.searchLayer].layerID;
                var imageParameters = new ImageParameters();
                imageParameters.layerIds = detailLayer;
                imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW; //defines that you only see the layer(s) listed above
                imageParameters.transparent = true; //the website says "Whether or not background of dynamic image is transparent."
                imageParameters.format = "png32" //this makes the opacity set at the service level actually work (untested outside of chrome)
                //maybe we can just use the featureLayer here
                dynamicMSL = new ArcGISDynamicMapServiceLayer(layersURL, {
                    "imageParameters": imageParameters
                });
                // console.log(currentMap);
                legendDijit = new Legend({
                    map: currentMap,
                    layerInfos: [{ layer: dynamicMSL }]
                    // }, 'esriLegend'); //end legendDijit new
                }, mapDetailsFromJson.legendID); //end legendDijit new
            }; //end makeTheLegend



            // mapDetails is the list of individula map details from all of the Slides
            $.each(mapDetails, function (k, slideMap) {
                // console.log("1.) current map: " + slideMap.containerID); //good
                // console.log(slideMap.containerID);
                // console.log(mapDetails); //good
                // console.log(slideMap);
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

                //disable map drag for touchcreen
                if (isTouchScreen === true) {
                    // currentMap.disablePan();
                    // currentMap.disableNavigation(); //not a function for esri, this works for googlemaps
                };


                //loop through slideMap.featureArray for each map (featureArray is a list of the layer #'s for the slide)
                $.each(slideMap.featureArray, function (j, layerNumber) {
                    var slide = mapLayers[layerNumber]; //this individual layer of the layers that will be on this map
                    var newLayer;

                    if (slide.type === "raster") {
                        console.log(layerNumber + " is a raster layer");
                    } //end if raster

                    if (slide.type === "geo") {
                        console.log(layerNumber + " is a geo layer");

                        var layerInfo = new WMSLayerInfo({
                            name: slide.layername,
                            title: slide.title
                        });
                        newLayer = new WMSLayer("https://geo2.daveytreekeeper.com/geoserver/Treekeeper/wms", {
                            resourceInfo: {
                                layerInfos: [layerInfo],
                                extent: new Extent(0, 0, 0, 0, { wkid: 4326 }),
                                featureInfoFormat: "text/html",
                                // getFeatureInfoURL: "http://geo.rowkeeper.com/geoserver/Treekeeper/ows",
                                //getMapURL: "http://geo.rowkeeper.com/geoserver/Treekeeper/ows"
                            },
                            visibleLayers: [
                                slide.layername
                            ],
                            version: "1.3.0"

                        });// end new WMSLayer
                    } //end if slidetype = geo

                    if (slide.type === "feature") {

                        var feature = slide;
                        // console.log(slide);

                        newLayer = new FeatureLayer(slide.url);
                    }

                    if (slide.type === "ArcGISDynamic") {
                        // var layerOptions = {
                        //     "id":       slide.layername,
                        //     "opacity":  1
                        // }

                        // newLayer = new ArcGISDynamicMapServiceLayer(slide.url,layerOptions);
                        // // newLayer.setVisibleLayers([slide.layerID]);
                        // console.log(newLayer);

                        var newLayerOptions = {
                            "id": slide.layername,
                            "opacity": 1
                        };
                        newLayer = new ArcGISDynamicMapServiceLayer(slide.infoUrl, newLayerOptions);
                        newLayer.setVisibleLayers([slide.layerID]);



                    }

                    currentMap.addLayer(newLayer);

                    if (slideMap.swipe === "true") {
                        if (slide.swipe === "true") {
                            // // console.log(currentMap);
                            // var layerIds = currentMap.layerIds;
                            // console.log(layerIds);
                            // var layer = layerIds[2];
                            // console.log(layer);

                            // var wholeLayer = currentMap.getLayer(layer);
                            // console.log(wholeLayer);

                            var swipeWidget = new LayerSwipe({
                                type: "vertical",
                                map: currentMap,
                                layers: [newLayer]
                            }, currentMap.swipeWidgetID);
                            swipeWidget.startup();

                        }
                    } // end if swipe
                }); //end .each layerNumber

                legendDijit.refresh();

                //still inside for-each-mapDetails loop
                // console.log(mapLayers[slideMap.searchLayer].layerID); //returns a number
                currentMap.on("click", function (event) {
                    console.log(slideMap.searchLayer + " has been clicked");
                    setPopups(event, slideMap, currentMap);
                }); //end on-click
                // console.log("!LAST)end of .each map/slide");
            }); //end .each





            // setGeoPopups = function (event, slideMap, currentMap) {
            //     console.log("setGeoPopups has been called");
            //     var popupLayer = mapLayers[slideMap.searchLayer];
            //     console.log(popupLayer);
            //     console.log(currentMap);
            // }; //end setGeoPopups



            // //      // ####5th wms test, geo layer from Bill Sample 
            // // it works 
            // esriConfig.defaults.io.corsEnabledServers.push("geo.rowkeeper.com");

            // var wmstest5_map = new Map('wmstest5_map', {
            //     basemap: 'streets',
            //     center: [-85.035534,
            //         40.616567],
            //     zoom: 8
            // });

            // var wmstest5_layer1 = new WMSLayerInfo({
            //     name: 'Treekeeper:AEPOH_Poles',
            //     title: 'Poles'
            // });

            // var resourceInfo = {
            //     extent: new Extent(0, 0, 0, 0, { wkid: 4326 }),
            //     layerInfos: [wmstest5_layer1]
            // };
            // wmstest5_layer = new WMSLayer("http://geo.rowkeeper.com/geoserver/Treekeeper/wms", {
            //     //visible: true,
            //     resourceInfo: {
            //         layerInfos: [wmstest5_layer1],
            //         //spatialReferences:[26916],
            //         extent: new Extent(0, 0, 0, 0, { wkid: 4326 }),
            //         featureInfoFormat: "text/html",
            //         getFeatureInfoURL: "http://geo.rowkeeper.com/geoserver/Treekeeper/ows",
            //         getMapURL: "http://geo.rowkeeper.com/geoserver/Treekeeper/ows"
            //     },
            //     visibleLayers: [
            //         "Treekeeper:AEPIM_Counties"
            //     ],
            //     version: "1.3.0"
            // });
            // wmstest5_map.addLayer(wmstest5_layer);



            //      // ####6th wms test, bring in my tk trees

            // var map = new Map('map', {
            //     basemap: 'streets',
            //     center: [-86.522406,
            //         39.167872],
            //     zoom: 12
            // });

            // var layer1 = new WMSLayerInfo({
            //     name: 'Treekeeper:BloomingtonIN_StreetJoin',
            //     title: 'Poles'
            // });

            // var test_layer = new WMSLayer("https://geo2.daveytreekeeper.com/geoserver/Treekeeper/wms", {
            //     //visible: true,
            //     resourceInfo: {
            //         layerInfos: [layer1],
            //         //spatialReferences:[26916],
            //         extent: new Extent(0, 0, 0, 0, { wkid: 4326 }),
            //         featureInfoFormat: "text/html",
            //         // getFeatureInfoURL: "http://geo.rowkeeper.com/geoserver/Treekeeper/ows",
            //         //getMapURL: "http://geo.rowkeeper.com/geoserver/Treekeeper/ows"
            //     },
            //     visibleLayers: [
            //         "Treekeeper:BloomingtonIN_StreetJoin"
            //     ],
            //     version: "1.3.0"
            // });
            // map.addLayer(test_layer)







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
            // console.log("here");
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


            //MY first swipe test
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
