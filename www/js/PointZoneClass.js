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
	this.moneyIcon = new LeafIcon({iconUrl: 'img/icons/money.png',iconSize:     new L.Point(30, 30),});
	var colors = ["aqua", "black", "blue", "fuchsia", "gray", "green","lime", "maroon", "navy", "olive", "orange", "purple", "red", "silver", "teal", "white"];
    
    this.pulsingGreen = L.icon.pulse({iconSize:[20,20],color:"green"});
    this.pulsingRed = L.icon.pulse({iconSize:[20,20],color:"red"});
    this.pulsingGray = L.icon.pulse({iconSize:[20,20],color:"gray"});
    this.moneyZones= new Array();
    this.negativeZones= new Array();
    this.positiveZones= new Array();
    this.communityZones= new Array();
		}
//get list of zones from the db
PointZoneClass.prototype.initialise = function() {
	this.getZonesList();
};


PointZoneClass.prototype.getZonesList=function(){
	var postUrl = "http://geocoin.eca.ed.ac.uk/getZones.php";
	var inputs =  {};//for amsterdam add this so anywhere the user is we can detect the zones within x miles of user location.
	var self=this;
	$.post(postUrl,inputs, function( data ) {
					self.zonesList = data;
					self.loadZoneLists(data);
					self.updateZonesMarkers();
					g_user.getNewBalabce();
					// console.log(data);
	});

};

PointZoneClass.prototype.loadZoneLists=function(_data){

	var moneyIndex = negativeIndex=communityIndex=positiveIndex=0; //TODO: no need for indexes as I could have used array length : /
if(g_moneyMarker.length>0)
	removeAllMarkers(g_moneyMarker);
if(g_negativeMarker.length>0)
	removeAllMarkers(g_negativeMarker);
if(g_communityMarker.length>0)
	removeAllMarkers(g_communityMarker);
if(g_positiveMarker.length>0)
	removeAllMarkers(g_positiveMarker);

	this.moneyZones= [];
	this.negativeZones= [];
	this.communityZones= [];
	this.positiveZones=[];

	var zoneType = "";
	var zone;
	for(var i = 0 ; i<_data.length;i++){
		zone = _data[i];
		switch (zone.zoneType) {
			case "money":
				this.moneyZones[moneyIndex]	= zone;
				moneyIndex++;
				break;
			case "negativeZone":
				this.negativeZones[negativeIndex]	= zone;
				negativeIndex++;
				break;
			case "communityZone":
				this.communityZones[communityIndex]	= zone;
				communityIndex++;
				break;
			case "positiveZone":
				this.positiveZones[positiveIndex]	= zone;
				positiveIndex++;
				break;
		}
	}
};



var g_moneyMarker=[];
var g_negativeMarker=[];
var g_communityMarker = [];
var g_positiveMarker = [];
PointZoneClass.prototype.updateZonesMarkers=function(){
	var zone;
	for(var i = 0 ; i<this.moneyZones.length ; i++){
		zone = this.moneyZones[i];
		g_moneyMarker[g_moneyMarker.length] = L.marker([zone.latitude,zone.longitude], {icon: this.moneyIcon}).addTo(g_map);
	}
	var newloc , marker; 
	for(var i = 0 ; i<this.negativeZones.length ; i++){
		zone = this.negativeZones[i];
		newloc = [zone.latitude,zone.longitude];
		g_negativeMarker[g_negativeMarker.length] = L.marker(newloc,{icon: this.pulsingRed}).addTo(g_map);
	}
	for(var i = 0 ; i<this.communityZones.length ; i++){
		zone = this.communityZones[i];
		newloc = [zone.latitude,zone.longitude];
		g_communityMarker[g_communityMarker.length] = L.marker(newloc,{icon: this.pulsingGreen}).addTo(g_map);
	}
};
PointZoneClass.prototype.isInMoneyZone=function(){
	var distanceToZone;
	for(var i = 0 ; i<this.moneyZones.length ; i++){
		zone = this.moneyZones[i];
		distanceToZone=getDistance( zone.latitude,zone.longitude, g_user.getUserLat(),g_user.getUserLon());
		if(distanceToZone<zone.radius/1000){
			// var marker = g_moneyMarker[zone.id];
			// map.removeLayer(maker);
			var postUrl = "http://geocoin.eca.ed.ac.uk/updateZone.php";
			var inputs =  { userId:g_user.getUserId(),
											zoneId:zone.id,
											type:zone.zoneType
										};
			$.post( postUrl,inputs).always(function(data){
				g_zones.getZonesList();
			});
		}
	}
	g_zones.getZonesList();

}

PointZoneClass.prototype.isInNegativeZones=function(){
	var distanceToZone;
	for(var i = 0 ; i<this.negativeZones.length ; i++){
		zone = this.negativeZones[i];
		distanceToZone=getDistance( zone.latitude,zone.longitude, g_user.getUserLat(),g_user.getUserLon());
		if(distanceToZone<zone.radius/1000){
			// var marker = g_moneyMarker[zone.id];
			// map.removeLayer(maker);
			var postUrl = "http://geocoin.eca.ed.ac.uk/updateZone.php";
			var inputs =  { userId:g_user.getUserId(),
											zoneId:zone.id,
											type:zone.zoneType
										};
			$.post( postUrl,inputs).always(function(data){
				g_user.updateBalabce();
			});
		}
	}
	g_user.getNewBalabce();

}
PointZoneClass.prototype.isInPositiveZones=function(){
	var distanceToZone;
	for(var i = 0 ; i<this.negativeZones.length ; i++){
		zone = this.negativeZones[i];
		distanceToZone=getDistance( zone.latitude,zone.longitude, g_user.getUserLat(),g_user.getUserLon());
		if(distanceToZone<zone.radius/1000){
			// var marker = g_moneyMarker[zone.id];
			// map.removeLayer(maker);
			var postUrl = "http://geocoin.eca.ed.ac.uk/updateZone.php";
			var inputs =  { userId:g_user.getUserId(),
											zoneId:zone.id,
											type:zone.zoneType
										};
			$.post( postUrl,inputs).always(function(data){
				g_user.updateBalabce();
			});
		}
	}
	g_user.getNewBalabce();

}
