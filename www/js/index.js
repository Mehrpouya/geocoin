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

var g_map;
var g_mySetting=new UserSetting();
initialiseMap();


function initialiseMap(){
    g_map = new L.map('map');//initialise map variable.
    addLayer();
}

// create the tile layer with correct attribution
function addLayer(){
    var defaultLayer = g_mySetting.getDefaultLayer();
    var layerUrl = defaultLayer[0];
    var attrib = defaultLayer[1];
    var mapLayer = new L.TileLayer(layerUrl, {minZoom: 8, maxZoom: 12, attribution: attrib});       
    // start the map in South-East England
    g_map.setView(new L.LatLng(51.3, 0.7),9);
    g_map.addLayer(mapLayer);

}



//This funciton will determine whether the user is inside one of the defined geo fences or not. 
function isInGeofence(){
    var isInside = false;



    return isInside;
}

//get current geolocation
function getMyLocation(){
    var myLocation = [41.0000,21.0000];

    return myLocation;
}



function getAllGeoFences(){
    var geoFences={};
    return geoFences;
}




