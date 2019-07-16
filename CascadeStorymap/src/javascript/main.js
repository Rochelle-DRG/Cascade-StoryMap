/** This controller request the Json data from our data source, the data is then parsed and used to generate the page
 * only after this data is returned and delt with do the remaining controllers get called.
 */
"use strict";

$.ajax({ crossDomain: true });

var mapPoints = {};
var mapLayers = {}; //dict of all the layers
var mapMaps = {};
var mapAttributes = [];
// var layerDictionary = {};
// loadTheMapController();

// Returning info from our "DB"
$.getJSON("database/page.json", function (data) {
    var slides = [];

    // forming a dict of layers to populate the map with in the next step
    $.each(data.Layers, function (k, layer) {
        mapLayers[k] = layer;
    });
    // $.each(data.Layers, function (k, layer) {

    // Loop each slide
    $.each(data.slides, function (k, jsonSlide) {
        // THe index is used for the mobile slides somehow
        var index = Object.keys(data.slides).indexOf(k);

        // Non local variable for doing things with map points
        mapPoints[k] = jsonSlide.MapAttributes;

        makeTheSlide(jsonSlide);
    });//end .each

}).always(function () {
    console.log("Data Loaded, Generating page...");
    // createMap();
    // enableMapControls();
    // enableMainControls();


}).fail(function () {
    alert("Sorry the page database failed to load, Please try again later");
});

var makeTheSlide = function (jsonSlide) {
    //make the <h1>
    if (jsonSlide.slideType === "welcome") {
        //var nodeh1 = document.createElement("h1");
        //nodeh1.setAttribute("id", jsonSlide.navLinkTitle);
        //creates the h1 element
        //var textnodeh1 = document.createTextNode(jsonSlide.title);  //creates a text node (neccessary)
        //nodeh1.appendChild(textnodeh1);                             // appends the text node to the element
        //document.getElementById("welcome").appendChild(nodeh1);     // appends the new element to the existing element in the html


        // createNavbarLinks(jsonSlide);



        // //make the <p>
        // var nodep = document.createElement("p");
        // var textnodep = document.createTextNode("");         //there is an extra step here because the string includes html markup that would otherwise be treated literally and be visible instead of working
        // nodep.appendChild(textnodep);
        // nodep.innerHTML = jsonSlide.writtenContent.join(" ");  //^ and the join removes the otherwise visible commas from the array
        // document.getElementById("welcome").appendChild(nodep);

    } //end if(welcome)

    if (jsonSlide.slideType === "mapSection") {
        //add the mapAttributes to a global array for map.js to build the maps with
        mapAttributes.push(jsonSlide.MapAttributes);




        //create <section >
        // var nodeSection = document.createElement("section");
        // nodeSection.setAttribute("id", jsonSlide.MapAttributes.sectionID);
        // document.getElementById("main-body").appendChild(nodeSection);
        
        //create <div id="" class="section-title">
        // var nodeDiv = document.createElement("div");
        // nodeDiv.setAttribute("id", jsonSlide.headerDivID);
        // nodeDiv.setAttribute("class", "section-title");
        // document.getElementById(jsonSlide.MapAttributes.sectionID).appendChild(nodeDiv);

        //h1 goes in ^ div 
        // var nodeh1 = document.createElement("h1");
        // nodeh1.setAttribute("id", jsonSlide.navLinkTitle);
        // var textnodeh1 = document.createTextNode(jsonSlide.title);
        // nodeh1.appendChild(textnodeh1);
        // document.getElementById(jsonSlide.headerDivID).appendChild(nodeh1);





        //next create a mapDiv and append it to the html
        //make a div with the id=slideContainer
        // var nodeMapDiv = document.createElement("div");
        // nodeMapDiv.setAttribute("id", jsonSlide.MapAttributes.containerID);
        // nodeMapDiv.setAttribute("class", "general-map content-section sticky");
        // nodeMapDiv.setAttribute("style", "z-index: 1");
        //append it to <section id= >
        // document.getElementById(jsonSlide.MapAttributes.sectionID).appendChild(nodeMapDiv);


        //##@@** Let's try putting the legend into one of these
        // var nodeDivLegend = document.createElement("div");
        // var legendId = jsonSlide.MapAttributes.containerID + "_legend";
        // // var textLegDiv = document.createTextNode("Hey, it's the legend div!");
        // // nodeDivLegend.appendChild(textLegDiv);
        // nodeDivLegend.setAttribute("id", legendId);
        // nodeDivLegend.setAttribute("class", jsonSlide.legendClass);
        // // nodeDivLegend.setAttribute("style", "position: sticky; top: 10px");
        // document.getElementById(jsonSlide.MapAttributes.sectionID).appendChild(nodeDivLegend);



        //need div for p's
        // var nodePDiv = document.createElement("div");
        // nodePDiv.setAttribute("id", jsonSlide.paragraphDivID);
        // nodePDiv.setAttribute("class", "sm-textbox");
        // document.getElementById(jsonSlide.MapAttributes.sectionID).appendChild(nodePDiv);




        //add the paragraph boxes
        // for (var i = 0, len = (jsonSlide.writtenContent).length; i < len; i++) {
            // console.log(jsonSlide.writtenContent);
            // var nodep = document.createElement("p");
            // var textnodep = document.createTextNode("");
            // nodep.appendChild(textnodep);
            // nodep.innerHTML = jsonSlide.writtenContent[i];
            // document.getElementById(jsonSlide.paragraphDivID).appendChild(nodep);
        // } //end for
    }; //end if mapSection

    if (jsonSlide.slideType === "textSection") {
        //1 make a div with an id=@ and class="lg-text-area"
        // var nodeTextDiv = document.createElement("div");
        // nodeTextDiv.setAttribute("id", jsonSlide.textSectionDivID);
        // nodeTextDiv.setAttribute("class", "lg-text-area");
        // document.getElementById("main-body").appendChild(nodeTextDiv);
        //make h1
        // var nodeh1 = document.createElement("h1");
        // var textnodeh1 = document.createTextNode(jsonSlide.title);
        // nodeh1.appendChild(textnodeh1);
        // nodeh1.setAttribute("id", jsonSlide.navLinkTitle);
        // document.getElementById(jsonSlide.textSectionDivID).appendChild(nodeh1);
        //p's
        // for (var i = 0, len = (jsonSlide.writtenContent).length; i < len; i++) {
        //     // console.log(jsonSlide.writtenContent);
        //     var nodep = document.createElement("p");
        //     var textnodep = document.createTextNode("");
        //     nodep.appendChild(textnodep);
        //     nodep.innerHTML = jsonSlide.writtenContent[i];
        //     document.getElementById(jsonSlide.textSectionDivID).appendChild(nodep);
        // } //end for
    } //end if "textSection" 

    if (jsonSlide.slideType !== "textSection" && jsonSlide.slideType !== "mapSection" && jsonSlide.slideType !== "welcome") {
        console.log("There has been a very strange error.");
    }
    // else {console.log("There has been an error.");} //for some reason this executes when it shouldn't so I'm turning it off
    createNavbarLinks(jsonSlide);

}; //end makeTheSlide function

function loadScript(src, callback) {
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => callback(null, script);
    script.onerror = () => callback(new Error(`Script load error for ${src}`));

    document.head.append(script);
};
var createNavbarLinks = function (jsonSlide) {
    //if the slide has a field navLinkTitle
    if (jsonSlide.hasOwnProperty("navLinkTitle")){
        //create an li
        // var nodeListItem = document.createElement("li");
        //create the link
        // var nodeAnchor = document.createElement("a");
        // nodeAnchor.setAttribute("href", "#" + jsonSlide.navLinkTitle);
        // nodeAnchor.setAttribute("class", "nav-links");
        // var textnodeLi = document.createTextNode(jsonSlide.navLinkTitle);
        // nodeAnchor.appendChild(textnodeLi);
        //add the achorto li
        // nodeListItem.appendChild(nodeAnchor);
        //add the li to to ul
        // document.getElementById("js-menu").appendChild(nodeListItem);
        //anchor to the h1's id
    }; //end if
}; //end createNavbarLinks

//nav bar behavior: toggle dropdown
let mainNav = document.getElementById('js-menu');
let logos = document.getElementById('logo-img');
let navBarToggle = document.getElementById('js-navbar-toggle');
navBarToggle.addEventListener('click', function () {
    mainNav.classList.toggle('active');
    logos.classList.toggle('logo-hide'); //without this line, the top item in the dropdown is out of alignment
});
// //nav bar behavior: show/hide navbar // decision was made to fix nav at top at all times
// var prevScrollpos = window.pageYOffset;
// window.onscroll = function () {
//     var currentScrollPos = window.pageYOffset;
//     if (prevScrollpos > currentScrollPos) {
//         document.getElementById("navbar").style.top = "0";
//     } else {
//         document.getElementById("navbar").style.top = "-50px";
//     }
//     prevScrollpos = currentScrollPos;
// } //end of window.onscroll


