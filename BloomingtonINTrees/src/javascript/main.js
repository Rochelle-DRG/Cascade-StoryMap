/** This controller request the Json data from our data source, the data is then parsed and used to generate the page
 * only after this data is returned and delt with do the remaining controllers get called.
 */
"use strict";

$.ajax({ crossDomain: true });

var mapPoints = {};
var mapLayers = {}; //dict of all the layers
var mapMaps = {};
var mapDetails = []; //array of maps //formerly mapAttributes

// Returning info from our "DB"
$.getJSON("database/4newpage.json", function (data) {

    // forming a dict of layers to populate the map with in the next step
    $.each(data.Layers, function (k, layer) {
        mapLayers[k] = layer;
        // console.log(layer.title + " added to mapLayers")
    });

    // Loop each map
    $.each(data.maps, function (k, jsonMap) {
        // THe index is used for the mobile maps somehow
        var index = Object.keys(data.maps).indexOf(k);

        // Non local variable for doing things with map points
        mapPoints[k] = jsonMap;

        mapDetails.push(jsonMap);
        // console.log(jsonMap.containerID + "was added to mapDetails");
    });//end .each

}).always(function () {
    console.log("Data Loaded, Generating page...");


}).fail(function () {
    alert("Sorry the page database failed to load, Please try again later");
});

function loadScript(src, callback) {
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => callback(null, script);
    script.onerror = () => callback(new Error(`Script load error for ${src}`));

    document.head.append(script);
};

//nav bar behavior: toggle dropdown
let mainNav         = document.getElementById('js-menu');
let logos           = document.getElementById('logo-img');
let navBarToggle    = document.getElementById('js-navbar-toggle');
navBarToggle.addEventListener('click', function () {
    mainNav.classList.toggle('active');
    logos.classList.toggle('logo-hide'); //without this line, the top item in the dropdown is out of alignment
    console.log('hey mainNav.classList.toggle(active)');

});
/** This code was is supposed to close the mobile dropdown menu when a selection is made
 * but it creates a bug where on desktop the list items are toggling when they should not be.
 */
// let navList         = document.getElementsByClassName('main-nav'); //formerly main-nav
// navList[0].addEventListener('click', function () {
//     mainNav.classList.toggle('active');
//     logos.classList.toggle('logo-hide'); //without this line, the top item in the dropdown is out of alignment
//     console.log('hey lines 60 mainNav.classList.toggle(active)');
//     console.log(navList[0]);
// });

function makeSwiper(parentDivId, swipeDivId){
    console.log("makeSwiper called");
    var swipeDiv = document.createElement('div');
    swipeDiv.id = swipeDivId;
    document.getElementById(parentDivId).appendChild(swipeDiv);
}

// For map clickableness and button toggle (used to use the overlay)
function toggleOverlay(mapId, buttonId, swipeId) {
    var x = document.getElementById(mapId);
    var y = document.getElementById(buttonId);
    if (y.innerText === "Click Here To Interact With Map"){
        // console.log(x.style.visibility);

        x.classList.toggle("unclickable");
        y.innerText= "Stop Exploring";
    }
    else {
        x.style.visibility = "visible";
        y.innerText= "Click Here To Interact With Map";
    }
    console.log(x.style.visibility);

};
function tryThis(param){
    console.log("called tryThis");
    console.log(param);
}

//For toggle legend
function toggleLegend(legendId, buttonId){
    console.log("toggleLegend has been called");
    var x = document.getElementById(legendId);
    var y = document.getElementById(buttonId);
    if (y.innerText === "View The Legend"){
        x.style.display = "block"
        y.innerText= "Hide The Legend";
    }
    else {
        x.style.display = "none";
        y.innerText= "View The Legend";
    }
}

//For toggle image bigger/normal
function toggleSize(chartPDivId){
    var chartDiv = document.getElementById(chartPDivId);
    chartDiv.classList.toggle("bigger");
}

//For the tour on the first map (all hard coded)
//Clicking on the Interact With Map Button begins the tour
var clickHere = document.getElementById('landcover_button');
clickHere.addEventListener('click', startTour );

function startTour(){
    console.log('starting tour');
     //remove click event
     clickHere.removeEventListener('click', startTour);

    //highlight the zoom buttons
    var zoom= document.getElementById('landcover_map_zoom_slider');
    var zoomIn = zoom.childNodes[0];
    var zoomOut = zoom.childNodes[1];
    zoomIn.classList.add('highlight');
    zoomOut.classList.add('highlight');

    //create the tour arrow div
    var zoomTour = document.createElement("img");
    zoomTour.src = "/BloomingtonINTrees/src/appearance/img/tour/500pxArrow_zoom.png";
    zoomTour.alt = "Click on the + and - icons to zoom in and out.";
    zoomTour.classList.add('zoom-tour');
    var parentElement = document.getElementById('landcover_map');
    var insertBefore = document.getElementById('landcover_slideHolder');
    parentElement.insertBefore(zoomTour, insertBefore);
   
    //when the user clicks anywhere, move on
    document.addEventListener('click',tourToggle, true);

    function tourToggle(){
        console.log("moving on to tourToggle");
        //remove DOM event listeners from previous method
        document.removeEventListener('click',tourToggle, true); 
        //remove highlight class from zoom buttons
        zoomIn.classList.remove('highlight');
        zoomOut.classList.remove('highlight');
    
        //remove arrow
        parentElement.removeChild(zoomTour);
    
        //create arrow pointing to toggle basemaps
        var toggleTour = document.createElement("img");
        toggleTour.src = "/BloomingtonINTrees/src/appearance/img/tour/600pxArrow_basemaptoggle.png";
        toggleTour.alt = "Click on this icon to toggle between street map and satellite map";
        toggleTour.classList.add('toggle-tour');
        parentElement.insertBefore(toggleTour, insertBefore);

        //highlight basemap toggle button
        var maptoggle= document.getElementById('landcover_bmtoggle');
        maptoggle.classList.add('highlight-toggleswitch');

        //add new event listener to DOM click anywhere
        document.addEventListener('click',tourPan, true);

        function tourPan(){
            console.log("moving to tourPan");
            //remove previous event listener
            document.removeEventListener('click',tourPan, true); 
            //remove highlight
            maptoggle.classList.remove('highlight-toggleswitch');
            //remove arrow
            parentElement.removeChild(toggleTour);
            //show new image
            var panTour = document.createElement("img");
            panTour.src = "/BloomingtonINTrees/src/appearance/img/tour/round_tourPan.png";
            panTour.alt = "Click and drag on the map to move it.";
            panTour.classList.add('toggle-tour');
            parentElement.insertBefore(panTour, insertBefore);
    
            //listen for click
            document.addEventListener('click',endTour, true);
            //end tour

            function endTour() {
            //remove previous event listener
            document.removeEventListener('click',endTour, true); 
            //remove circle
            parentElement.removeChild(panTour);
            }
        }
    }


    
};



