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
var g_user=new UserSettingClass();
var g_zones=new PointZoneClass();
var g_debugMode= false;
initialiseMap();
initialiseUser();
initialiseZones();
var g_addSampleZones = false;
var rbsLat=55.934779444089145,rbsLng=-3.333878517150879;
var hLat=55.935816499999994,hLng=-3.1797991;
var ecaLat=55.94593740,ecaLong=-3.2004938 ;
//52.35377500,4.91228700
//look at user setting and do things like show the user location if it is in the setting and so on....
function initialiseUser(){
  var touchzone = document.getElementById("marriageBut");
  // Add an event handler for the touchstart event
  // touchzone.addEventListener("touchend", getMarried, false);
  touchzone.addEventListener("click", getMarried, false);
  var infoS = document.getElementById("infoScreen");
  infoS.addEventListener("click", function(){$("#infoScreen").hide("slow")}, false);
  var infoShow = document.getElementById("showInfo");
  infoShow.addEventListener("click", function(){$("#infoScreen").toggle("slow")}, false);
  var bitcoinIcon = document.getElementById("bitcoinIcon");
  bitcoinIcon.addEventListener("click", function(){$("#userStats").toggle("slow");}, false);
  var loginButton = document.getElementById("loginBut");
  loginButton.addEventListener("click",loginUser , false);


  getLocation();
  if(g_user.getShowLocation){
    addUserLocation();
  }
  if(!g_debugMode)
  setInterval(getLocation, g_user.locationSetting.locationRefreshInterval);
  g_user.checkIfMarried();
  if(g_user.is_married){
    $("#marriageBut").attr('value', 'Divorce!');
    $("#bitcoinIcon").attr("src", "img/icons/double_bitcoin.png");
    alert("");
    //
  }
  else
    $("#marriageBut").attr('value', 'Get Married');
    $("#bitcoinIcon").attr("src", "img/icons/single_bitcoin.png")
}




function initialiseZones(){
}
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
  g_map.on('click', function(e) { $("#infoScreen").hide("slow") });
  addLayer();
}
// create the tile layer with correct attribution
function addLayer(){
  // var defaultLayer = g_user.getDefaultLayer();
  // var layerUrl = defaultLayer[0];
  // var attrib = defaultLayer[1];
  // var mapLayer = new L.TileLayer(layerUrl, {minZoom: 8, maxZoom: 20, attribution: attrib});
  // g_map.setView(new L.LatLng(55.94860300,-3.18460200 ),18);
  // g_map.addLayer(mapLayer);
  var carto = new L.TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
});
var osmThunder = new L.TileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png');
g_map.setView([55.953193, -3.198914], 15);
g_map.addLayer(carto);
  if(g_debugMode)
  g_map.on("click", _update, this);
}
//This funciton will determine whether the user is inside one of the defined geo fences or not.
function isInGeofence(){

  g_user.updatePartners();
  g_zones.isInMarriageZone();
  // if(g_user.partnersTogether){
    g_zones.isInOneoffZone();
    g_zones.isInContinuesZones();
  // }
  }
  function makeSampleGeoFences(){
    var loc = g_user.getUserLoc();
    var colors = ["aqua", "black", "blue", "fuchsia", "gray", "green","lime", "maroon", "navy", "olive", "orange", "purple", "red", "silver", "teal", "white"];
    for(var i =0; i<8;i++){
      var newloc = [g_user.getUserLoc()[0]+Math.random()/100,g_user.getUserLoc()[1]+Math.random()/100];
      var pulsingIcon = L.icon.pulse({iconSize:[20,20],color:colors[Math.floor(Math.random()*15)]});
      var marker = L.marker(newloc,{icon: pulsingIcon}).addTo(g_map);
      var newloc = [g_user.getUserLoc()[0]-Math.random()/100,g_user.getUserLoc()[1]-Math.random()/100];
      var pulsingIcon = L.icon.pulse({iconSize:[20,20],color:colors[Math.floor(Math.random()*15)]});
      var marker = L.marker(newloc,{icon: pulsingIcon}).addTo(g_map);
    }
  }
  //This will use the geo locaiton and update the user setting variable
  //it will also calles is in geofence.
  function updateUserLocation(_location){
    g_user.setUserLoc(_location);
    // console.log(_location);
    //  g_map.setView(g_user.getUserLoc(),18);
    if (g_addSampleZones){
      makeSampleGeoFences();
      g_addSampleZones=false;
    }

    isInGeofence();
  }
  function addUserLocation(){
    g_user.getMarker().addTo(g_map);
  }

  var g_snd = new Audio("sounds/cheer-03.ogg"); // buffers automatically when created
  function getMarried(){
    if(!g_user.is_married){
      if(g_user.userInMarriageZone){
        // g_snd.play();
        // $("#marriageBut").attr('disabled','disabled').delay(2000).toggleDisabled();
        $("#youCollected").html("You proposed, now wait for spouses!").show(0).delay(5000).hide(0);
        registerMarriage();
      }
      else{
        $("#youCollected").html("you are not in a marriage zone! go closer, don't be afraid!").show(0).delay(3000).hide(0);
      }
    }else{
      var postUrl = g_baseURL+"divorce.php";
    	var inputs =  { userId:g_user.getId()};
    	$.post( postUrl,inputs, function( data ) {
        localStorage.clear();
        location.reload();
    	});
    }
  }

  function registerMarriage(){
    var myurl = g_baseURL + "propose.php";
    var inputs =  { userId:g_user.getId(),
      longitude:g_user.locationSetting.location[1],
      latitude:g_user.locationSetting.location[0],
      zoneid:g_user.marriageZone
    };
    console.log(inputs);
    $.post( myurl,inputs, function( data ) {
      console.log(data);
    });
  }

  (function($) {
      $.fn.toggleDisabled = function(){
          return this.each(function(){
              this.disabled = !this.disabled;
          });
      };
  })(jQuery);

function loginUser(){
  var url = g_baseURL+"registerUser.php";
  var uname = $("#usernameTxt").val();
  var inputs = {"userName":uname};
  if (uname.length>0)
  {
    var self=this;
    $.post( url,inputs).always(function(data) {
      console.log(data);
      if(data.status=="sucess"){
        localStorage.setItem("userName",uname);
        localStorage.setItem("id",data.userId);
        localStorage.setItem("walletName",data.walletName);
        $("#user").html('<img src="img/icons/personRed.png" class="balanceIcons"/>'+uname);
        $("#login").hide("slow");
      }
      else
      console.log(data.status);
    });
    //make a call to the php page and set the userName in the localstorage.
  }
}
