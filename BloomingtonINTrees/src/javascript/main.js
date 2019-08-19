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
    });

    // Loop each map
    $.each(data.maps, function (k, jsonMap) {
        // THe index is used for the mobile maps somehow
        var index = Object.keys(data.maps).indexOf(k);

        // Non local variable for doing things with map points
        mapPoints[k] = jsonMap;

        mapDetails.push(jsonMap);
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
});
let navList         = document.getElementsByClassName('main-nav');
navList[0].addEventListener('click', function () {
    mainNav.classList.toggle('active');
    logos.classList.toggle('logo-hide'); //without this line, the top item in the dropdown is out of alignment
});

function makeSwiper(parentDivId, swipeDivId){
    console.log("makeSwiper called");
    var swipeDiv = document.createElement('div');
    swipeDiv.id = swipeDivId;
    document.getElementById(parentDivId).appendChild(swipeDiv);
}

// For map overlay and button toggle
function toggleOverlay(overlayId, buttonId, swipeId) {
    var x = document.getElementById(overlayId);
    var y = document.getElementById(buttonId);
    if (y.innerHTML === "Click Here To Interact With Map"){
        x.style.display = "none";
        y.innerHTML= "Stop Exploring";
    }
    else {
        x.style.display = "block";
        y.innerHTML= "Click Here To Interact With Map";
    }
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
    if (y.innerHTML === "View The Legend"){
        x.style.display = "block"
        y.innerHTML= "Hide The Legend";
    }
    else {
        x.style.display = "none";
        y.innerHTML= "View The Legend";
    }
}


