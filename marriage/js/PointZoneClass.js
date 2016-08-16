/*
Copyright (C) 2016 Hadi Mehrpouya <http://www.hadi.link>
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Author: Hadi Mehrpouya
Research Project title: After Money, University of Edinburgh in collaboration with New Economic Foundation (NEF) and Royal Bank of Scotland (RBS)
*/

function PointZoneClass () {
	this.initialise();
	this.moneyIcon = new LeafIcon({iconUrl: 'img/icons/money.png',iconSize: new L.Point(30, 30),});
	this.antimoneyIcon = new LeafIcon({iconUrl: 'img/icons/antimoney.png',iconSize: new L.Point(30, 30),});
	this.marriageZones=[];


	var colors = ["aqua", "black", "blue", "fuchsia", "gray", "green","lime", "maroon", "navy", "olive", "orange", "purple", "red", "silver", "teal", "white"];

	this.pulsingGreen = L.icon.pulse({iconSize:[20,20],color:"green"});
	this.pulsingRed = L.icon.pulse({iconSize:[20,20],color:"red"});
	this.pulsingGray = L.icon.pulse({iconSize:[20,20],color:"gray"});
	this.pulsingOrange = L.icon.pulse({iconSize:[20,20],color:"orange"});
	this.pulsingPink = new LeafIcon({iconUrl: 'img/icons/wZone.png',iconSize: new L.Point(80, 80),});
	this.oneoffZones= new Array();
	this.continuesZones= new Array();
	this.positiveZones= new Array();
	this.communityZones= new Array();
	this.getMarriageZones();
}
//get list of zones from the db
PointZoneClass.prototype.initialise = function() {
	this.getZonesList();
};


PointZoneClass.prototype.getZonesList=function(){
	var postUrl = g_baseURL+"getZones.php";
	var inputs =  {};//for amsterdam add this so anywhere the user is we can detect the zones within x miles of user location.
	var self=this;
	$.post(postUrl,inputs, function( data ) {
		self.zonesList = data;
		self.loadZoneLists(data);
		self.updateZonesMarkers();
		self.getMarriageZones();
		g_user.getNewBalabce();
		// console.log(data);
	});

};

PointZoneClass.prototype.getMarriageZones=function(){
	var postUrl = g_baseURL+"getMarriageZone.php";
	var inputs =  {};//for amsterdam add this so anywhere the user is we can detect the zones within x miles of user location.
	var self=this;
	$.post(postUrl,inputs, function( data ) {
		self.marriageZones = data;
		self.loadMarriageZoneMarkers(data);
	}).always(function(data){
	});

};


PointZoneClass.prototype.loadMarriageZoneMarkers=function(_data){
	for(var i = 0 ; i<this.marriageZones.length ; i++){
		zone = this.marriageZones[i];
		newloc = [zone.latitude,zone.longitude];
		myIcon = this.pulsingPink;
		g_continuesMarker[g_continuesMarker.length] = L.marker(newloc,{icon: myIcon}).addTo(g_map);
		/*.bindLabel(zone.radius+" meters", {
    noHide: true,
    direction: 'auto'
})*/
	}

}
PointZoneClass.prototype.loadZoneLists=function(_data){

	var oneoffIndex = continuesIndex=0; //TODO: no need for indexes as I could have used array length : /
	if(g_oneoffMarker.length>0)
	removeAllMarkers(g_oneoffMarker);
	if(g_continuesMarker.length>0)
	removeAllMarkers(g_continuesMarker);

	this.oneoffZones= [];
	this.continuesZones= [];

	var zoneType = "";
	var zone;
	for(var i = 0 ; i<_data.length;i++){
		zone = _data[i];
		if(zone.zoneType ==="oneoff") {
			this.oneoffZones[oneoffIndex]	= zone;
			oneoffIndex++;
		}
		else if(zone.zoneType ==="continues") {
			this.continuesZones[continuesIndex]	= zone;
			continuesIndex++;
		}
	}
};



var g_oneoffMarker=[];
var g_continuesMarker=[];
PointZoneClass.prototype.updateZonesMarkers=function(){
	var zone,myIcon;
	for(var i = 0 ; i<this.oneoffZones.length ; i++){
		zone = this.oneoffZones[i];
		myIcon = this.moneyIcon;
		if(zone.value<0)myIcon=this.antimoneyIcon;
		g_oneoffMarker[g_oneoffMarker.length] = L.marker([zone.latitude,zone.longitude], {icon: myIcon}).addTo(g_map);
	}
	var newloc , marker;
	for(var i = 0 ; i<this.continuesZones.length ; i++){
		zone = this.continuesZones[i];
		newloc = [zone.latitude,zone.longitude];
		myIcon = this.pulsingGreen;
		if(zone.value<0)myIcon=this.pulsingRed;

		if(zone.id===142 || zone.id==="142"){myIcon=this.pulsingOrange;};
		g_continuesMarker[g_continuesMarker.length] = L.marker(newloc,{icon: myIcon}).addTo(g_map);
	}
};
var g_chaching = new Audio("sounds/chaching.ogg"); // buffers automatically when
PointZoneClass.prototype.isInOneoffZone=function(){
	var distanceToZone;
	for(var i = 0 ; i<this.oneoffZones.length ; i++){
		zone = this.oneoffZones[i];
		distanceToZone=getDistance( zone.latitude,zone.longitude, g_user.getUserLat(),g_user.getUserLon());
		if(distanceToZone<zone.radius/1000){
			// var marker = g_oneoffMarker[zone.id];
			// map.removeLayer(maker);
			var postUrl = g_baseURL + "updateZone.php";
			var uId=g_user.getUserId();
			$("#youCollected").show().delay(5000).queue(function(n) {
$(this).hide(); n();
});
			if(g_user.is_married)
			uId=g_user.getMarriageUserId();
			var inputs =  {
				userId:uId,
				zoneId:zone.id,
				type:zone.zoneType,
				value:zone.value
			};
			console.log(inputs);
			$.post( postUrl,inputs).always(function(data){
				g_chaching.play();
				g_zones.getZonesList();
			});
		}
	}
	g_zones.getZonesList();
}

PointZoneClass.prototype.isInContinuesZones=function(){
	var distanceToZone;
	for(var i = 0 ; i<this.continuesZones.length ; i++){
		zone = this.continuesZones[i];
		distanceToZone=getDistance( zone.latitude,zone.longitude, g_user.getUserLat(),g_user.getUserLon());
		if(distanceToZone<zone.radius/1000){
			// var marker = g_oneoffMarker[zone.id];
			// map.removeLayer(maker);
			var postUrl = g_baseURL+"updateZone.php";
			var uId=g_user.getUserId();
			if(g_user.is_married)
			uId=g_user.getMarriageUserId();
			var inputs =  {
				userId:uId,
				zoneId:zone.id,
				type:zone.zoneType,
				value:zone.value
			};
			$.post( postUrl,inputs).always(function(data){
				console.log(data);
				g_user.getNewBalabce();
			});
		}
	}
	g_user.getNewBalabce();
}
//if they are in save which one they are in for marriage zone!
PointZoneClass.prototype.isInMarriageZone=function(){
	var distanceToZone;
	for(var i = 0 ; i<this.marriageZones.length ; i++){
		zone = this.marriageZones[i];

		distanceToZone=getDistance( zone.latitude,zone.longitude, g_user.getUserLat(),g_user.getUserLon());
		if(distanceToZone<zone.radius/1000){
			// var marker = g_oneoffMarker[zone.id];
			// map.removeLayer(maker);
			g_user.userInMarriageZone=true;
			g_user.marriageZone = zone.id;
			break;
		}else{
			g_user.userInMarriageZone=false;
		}
	}
	g_user.getNewBalabce();
}
