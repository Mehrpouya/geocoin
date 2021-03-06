/*
Copyright (C) 2016 Hadi Mehrpouya <https://www.hadi.link>
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Author: Hadi Mehrpouya
Research Project title: After Money, University of Edinburgh in collaboration with New Economic Foundation (NEF) and Royal Bank of Scotland (RBS)
*/


var g_baseURL = "https://geocoin.eca.ed.ac.uk/";
function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updateUserLocation);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

var LeafIcon = L.Icon.extend({
	options: {
        // shadowUrl: 'img/icons/userIconShadow.png',
        // iconSize:     new L.Point(50, 50),
        // shadowSize:   [50, 64],
        // iconAnchor:   new L.Point(16, 16),
        // shadowAnchor: [4, 62],
        popupAnchor:  new L.Point(16, 16)
    }
});
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

function getDistance(_lat1,_lon1,_lat2,_lon2){
	var dist;
  var rlat1 = Math.radians( _lat1 ),
	rlat2 = Math.radians( _lat2 ),
  rlon1 = Math.radians( _lon1 ),
	rlon2 = Math.radians( _lon2 );
  dist  = Math.acos( Math.cos( rlat1 ) * Math.cos( rlon1 ) * Math.cos( rlat2 ) * Math.cos( rlon2 ) + Math.cos( rlat1 ) * Math.sin( rlon1 ) * Math.cos( rlat2 ) * Math.sin( rlon2 ) + Math.sin( rlat1 ) * Math.sin( rlat2 ) ) * 6372.8;
  return dist;
}


 function _update(evt) {
		var pos = evt.latlng,
    pos = pos.wrap();
    console.log(pos);
		if (pos) {
      g_user.setUserLoc(pos);
      g_map.setView(g_user.getUserLoc());
      isInGeofence();
		}
	};


  function removeAllMarkers(_markersArray){
    var marker;
    for(var i=0;i<_markersArray.length;i++){
      marker=_markersArray[i];
      g_map.removeLayer(marker);
    }
    _markersArray=[];


  }
