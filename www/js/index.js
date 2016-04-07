/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// var app = {
//     // Application Constructor
//     initialize: function() {
//         this.bindEvents();
//     },
//     // Bind Event Listeners
//     //
//     // Bind any events that are required on startup. Common events are:
//     // 'load', 'deviceready', 'offline', and 'online'.
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//     },
//     // deviceready Event Handler
//     //
//     // The scope of 'this' is the event. In order to call the 'receivedEvent'
//     // function, we must explicitly call 'app.receivedEvent(...);'
//     onDeviceReady: function() {
//         app.receivedEvent('deviceready');
//     },
//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//         var parentElement = document.getElementById(id);
//         var listeningElement = parentElement.querySelector('.listening');
//         var receivedElement = parentElement.querySelector('.received');

//         listeningElement.setAttribute('style', 'display:none;');
//         receivedElement.setAttribute('style', 'display:block;');

//         console.log('Received Event: ' + id);
//     }
// };

// app.initialize();


/*
imporatant settings
1. browser
Web Storage     Chrome>4.0     Edge>12.0    IE>8.0     Firefox>3.5     Safari>4.0     Opera>11.5
*/

var g_map;
var g_mySetting=new UserSetting();
initialiseMap();
initialiseUser();


var g_firstTime = true;



//TODO: add this somewhere and decide what to do if storage is not suppoted.
function checRequirements(){
    //check browser support
    if(typeof(Storage) == "undefined") {
      alert("this browser is not supported. Do you have Chrome or Firefox?");
    }
}


function initialiseMap(){
  checRequirements();
    g_map = new L.map('map');//initialise map variable.
    addLayer();
}

// create the tile layer with correct attribution
function addLayer(){
    var defaultLayer = g_mySetting.getDefaultLayer();
    var layerUrl = defaultLayer[0];
    var attrib = defaultLayer[1];
    var mapLayer = new L.TileLayer(layerUrl, {minZoom: 8, maxZoom: 16, attribution: attrib});
    // start the map in South-East England
    g_map.setView(new L.LatLng(55.945925800000005, -3.2005949),15);
    g_map.addLayer(mapLayer);
}


//This funciton will determine whether the user is inside one of the defined geo fences or not.
function isInGeofence(){
    var isInside = false;
    return isInside;
}

function getAllGeoFences(){
    var geoFences={};
    return geoFences;
}

function makeSampleGeoFences(){
    var loc = g_mySetting.getUserLoc();
    var colors = ["aqua", "black", "blue", "fuchsia", "gray", "green","lime", "maroon", "navy", "olive", "orange", "purple", "red", "silver", "teal", "white"];
    for(var i =0; i<8;i++){

    var newloc = [g_mySetting.getUserLoc()[0]+Math.random()/100,g_mySetting.getUserLoc()[1]+Math.random()/100];
    var pulsingIcon = L.icon.pulse({iconSize:[20,20],color:colors[Math.floor(Math.random()*15)]});
var marker = L.marker(newloc,{icon: pulsingIcon}).addTo(g_map);
    var newloc = [g_mySetting.getUserLoc()[0]-Math.random()/100,g_mySetting.getUserLoc()[1]-Math.random()/100];
    var pulsingIcon = L.icon.pulse({iconSize:[20,20],color:colors[Math.floor(Math.random()*15)]});

    var marker = L.marker(newloc,{icon: pulsingIcon}).addTo(g_map);
}
}

//look at user setting and do things like show the user location if it is in the setting and so on....
function initialiseUser(){
    getLocation();
    if(g_mySetting.getShowLocation){
        addUserLocation();
    }
    setInterval(getLocation, g_mySetting.locationSetting.locationRefreshInterval);
}
//This will use the geo locaiton and update the user setting variable
function updateUserLcation(_location){
   g_mySetting.setUserLoc(_location);
   g_map.setView(g_mySetting.getUserLoc(),15);
   if (g_firstTime){
       makeSampleGeoFences();
       g_firstTime=false;
   }


// read_user_basic
// send_my_tips_on_channel
// read_my_tips_on_channel


}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updateUserLcation);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function addUserLocation(){
    g_mySetting.getMarker().addTo(g_map);
}
