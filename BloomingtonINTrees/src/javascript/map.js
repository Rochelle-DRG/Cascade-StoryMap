
$(document).ready(function () {
    require([
        "esri/map",                     //1
        "esri/layers/FeatureLayer",     //2
        "esri/layers/WMSLayer",         //3
        "esri/layers/WMSLayerInfo",     //4
        // "esri/config",                  //5
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
        "esri/layers/RasterLayer",      //23
        "esri/layers/RasterFunction",   //24

        "dijit/layout/BorderContainer", //always last, no function match
        "dijit/layout/ContentPane",     //always last, no function match
        "dojo/domReady!"                //always last, no function match

    ], function (Map,                   //1
        FeatureLayer,                   //2
        WMSLayer,                       //3
        WMSLayerInfo,                   //4
        // esriConfig,                     //5
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
        parser,                         //22
        RasterLayer,                    //23
        RasterFunction) {                 //24

        dojo.require("esri.tasks.query"); //part of 1st attempt setGeoPopups https://developers.arcgis.com/javascript/3/jssamples/query_clickinfowindow.html

        var layersURL = "https://gis.davey.com/arcgis/rest/services/BloomingtonIN/BloomintonIN/MapServer";
        var isTouchScreen;

        function isTouchDevice() { return 'ontouchstart' in document.documentElement; }
        if (isTouchDevice()) {  /*on mobile*/ isTouchScreen = true; }
        else { /*on desktop*/ isTouchScreen = false; };
        console.log("isTouchScreen: " + isTouchScreen);


        setPopups = function (event, slideMap, currentMap) {
            if (slideMap.searchLayer.length > 0) {
                let popupLayer = mapLayers[slideMap.searchLayer];
                console.log(popupLayer);
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
                var deferred = identifyTask
                    .execute(identifyParams)
                    .addCallback(function (response) {

                        if (response.length > 0) {//if there should be a popup
                            return arrayUtils.map(response, function (result) {
                                var feature = result.feature;
                                var layerName = result.layerName;
                                feature.attributes.layerName = layerName;
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
            }
        }; //end setPopups()



        makeTheLegend = function (mapDetailsFromJson, currentMap) {
            // console.log("makeTheLegend for: "+ mapDetailsFromJson.containerID);
            if (mapDetailsFromJson.searchLayer.length > 0) {
                var detailLayer = mapLayers[mapDetailsFromJson.searchLayer].layerID;
                console.log(detailLayer);
                var imageParameters = new ImageParameters();
                imageParameters.layerIds = detailLayer;
                imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW; //defines that you only see the layer(s) listed above
                imageParameters.transparent = true; //the website says "Whether or not background of dynamic image is transparent."
                imageParameters.format = "png32" //this makes the opacity set at the service level actually work (untested outside of chrome)
                //maybe we can just use the featureLayer here
                dynamicMSL = new ArcGISDynamicMapServiceLayer(layersURL, {
                    "imageParameters": imageParameters
                });
                legendDijit = new Legend({
                    map: currentMap,
                    layerInfos: [{ layer: dynamicMSL }]
                    // }, 'esriLegend'); //end legendDijit new
                }, mapDetailsFromJson.legendID); //end legendDijit new
            };
            if (mapDetailsFromJson.searchLayer.length = "toggler") {
                console.log(mapDetailsFromJson.containerID + " does not have a legend");
            }
        }; //end makeTheLegend



        // mapDetails is the list of individula map details from all of the Slides
        $.each(mapDetails, function (k, slideMap) {
            // console.log(slideMap.containerID);
            let currentMap = new Map(slideMap.containerID, {
                basemap: slideMap.basemap,
                center: slideMap.mapCenter,
                zoom: slideMap.zoom,
            }); //end var currentMap= new Map
            // other enable/disables here: https://developers.arcgis.com/javascript/3/jshelp/intro_navigation.html
            currentMap.on("load", function () {
                currentMap.disableScrollWheel();
            });
            makeTheLegend(slideMap, currentMap);

            //add click event to basemap toggle
            var basemapToggleID = slideMap.basemapToggleID;
            var currentToggleButton = document.getElementById(basemapToggleID);

            //the "if" statement is only needed until I have added a togglebutton to the html for each map
            if (typeof basemapToggleID !== "undefined") {
                currentToggleButton.addEventListener('click', function () {
                    console.log("click accepted!");
                    var currentBasemap = currentMap.getBasemap();
                    currentToggleButton.classList.toggle("satellite");
                    if (currentBasemap === "satellite") {
                        currentMap.setBasemap("osm");
                    }//end if satellite
                    if (currentBasemap === "osm") {
                        currentMap.setBasemap("satellite");
                    }//end if osm
                }); //end eventListener onclick
            }; //end if basemapToggleID not undefined


            //loop through slideMap.featureArray for each map (featureArray is a list of the layer #'s for the slide)
            $.each(slideMap.featureArray, function (j, layerNumber) {

                var slide = mapLayers[layerNumber]; //this individual layer of the layers that will be on this map
                var newLayer;
                // console.log("layerNumber: "+layerNumber);

                newLayer = new ArcGISDynamicMapServiceLayer("https://gis.davey.com/arcgis/rest/services/BloomingtonIN/BloomintonIN/MapServer");
                newLayer.setVisibleLayers([slide.layerID]);
                newLayer.setOpacity(slide.opacity);
                newLayer.DRGid = layerNumber; //I have added this property to the layer so that we can easily search and compare layers later
                newLayer._div = currentMap.root;
                currentMap.addLayers([newLayer]);
                // console.log(newLayer.id + " : "+ newLayer.DRGid);

                if (slideMap.swipe === "true") {
                    if (slide.swipe === "true") {
                        var layerIds = currentMap.layerIds;
                        var swipeWidget = new LayerSwipe({
                            type: "vertical",
                            map: currentMap,
                            layers: [newLayer]
                        }, slideMap.swipeWidgetID);
                        // console.log(slideMap.swipeWidgetID);
                        // console.log(newLayer);

                        swipeWidget.startup();
                    }   //end if slide swipe
                } // end if map swipe
            }); //end .each layerNumber

            legendDijit.refresh();

            //still inside for-each-mapDetails loop
            currentMap.on("click", function (event) {
                setPopups(event, slideMap, currentMap);
            }); //end on-click

            /** To use the layer toggle, the buttons need moved to that maps's html div
             *  AND in the json the map must have a property of "toggleLayers": "true"**/
            //Layer Toggle
            turnOnLayer = function (layerNumber, map, button) {
                var newLayer;
                var slide = mapLayers[layerNumber]; //this individual layer of the layers that will be on this map
                newLayer = new ArcGISDynamicMapServiceLayer("https://gis.davey.com/arcgis/rest/services/BloomingtonIN/BloomintonIN/MapServer");
                newLayer.setVisibleLayers([slide.layerID]);
                newLayer.setOpacity(slide.opacity);
                newLayer.DRGid = layerNumber;
                newLayer._div = map.root;
                map.addLayers([newLayer]);
                button.classList.add("button-clicked");
                map.on("click", function (event) {
                    console.log(layerNumber + " was clicked");
                    setPopupsForToggleLayers(event, slideMap, layerNumber, map);
                });
            }


            setPopupsForToggleLayers = function (event, slideMap, layerNumber, currentMap) {
                let popupLayer = mapLayers[layerNumber];
                //console.log(popupLayer); //success
                identifyTask = new IdentifyTask(popupLayer.infoUrl);
                identifyParams = new IdentifyParameters();
                identifyParams.tolerance = 10;
                identifyParams.returnGeometry = true;
                identifyParams.layerIds = popupLayer.layerID; //this can be multiple layers, but we're just using one right now
                identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
                identifyParams.width = currentMap.width;
                identifyParams.height = currentMap.height;
                identifyParams.geometry = event.mapPoint;
                identifyParams.mapExtent = currentMap.extent;
                var deferred = identifyTask
                    .execute(identifyParams)
                    .addCallback(function (response) {

                        if (response.length > 0) {//if there should be a popup
                            return arrayUtils.map(response, function (result) {
                                var feature = result.feature;
                                var layerName = result.layerName;
                                feature.attributes.layerName = layerName;
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
            }; //end setPopupsForToggleLayers



            //if map has layerToggle (only 1 does right now, so I can search the whole document, else I would have to only search this map)
            if (slideMap.toggleLayers === "true") {
                //get all the buttons (there are only 4 in the whole doc so this works)
                var fourButtons = document.getElementsByClassName("layer-switch");
                //loop through each button with that class
                for (var i = 0; i < 4; i++) {
                    let button = fourButtons[i];
                    button.addEventListener("click", function () {
                        //##was the layer already turned on?
                        let wasOn = false;
                        if (button.classList.contains("button-clicked") === true) {
                            wasOn = true;
                        };

                        //##see if any of the button layers are turned on and turn it off
                        let currentLayers = currentMap.getLayersVisibleAtScale(72223.819286);
                        for (var j = 0; j < currentLayers.length; j++) {
                            let oneOfCurrentLayers = currentLayers[j];
                            if (oneOfCurrentLayers.DRGid === "Layer4" ||
                                oneOfCurrentLayers.DRGid === "Layer5" ||
                                oneOfCurrentLayers.DRGid === "Layer6" ||
                                oneOfCurrentLayers.DRGid === "Layer3") {
                                // console.log("must remove " + oneOfCurrentLayers.DRGid);
                                currentMap.removeLayer(oneOfCurrentLayers);
                            } //end if this layer already is on
                        };//end for each layer on the map

                        //##unselect all of the buttons
                        for (var k = 0; k < 4; k++) {
                            let b = fourButtons[k];
                            b.classList.remove("button-clicked");
                        };

                        //##if the button clicked was not already clicked
                        if (wasOn === false) {
                            turnOnLayer(button.getAttribute("value"), currentMap, button);
                        };
                    }); //end onclick
                }//end for
            }//end if this map has ToggleLayers

            //change button class to indicate turned off
            //change click event to Turn On Layer

        }); //end .each



    }); //end require/function

}); //end doc.ready


// var tryThisFunction = function(map){
//     console.log('called the function');
// }