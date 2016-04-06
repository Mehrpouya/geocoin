/*

*/

function UserSetting () {
	this.layersList = {osm:['http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png','Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors']};
	this.defaultLayer = this.layersList["osm"];
	this.locationSetting = {
		showLocation:true,
		locationRefreshInterval:10000,
		followUser:true,//this means when the user locaiton moves, always keep the user in the centre of the map.
		location:[55.945925800000005, -3.2005949],
		locAccuracy:0,
		locTimestamp:0
	};
	this.locIcon = new LeafIcon({iconUrl: 'img/icons/userIcon.png'});
	this.marker = L.marker([51.3, 0.7], {icon: this.locIcon});
    this.initialiseUser();
		}
UserSetting.prototype.getDefaultLayer = function() {
    return this.defaultLayer;
};

UserSetting.prototype.getShowLocation = function() {
    return this.locationSetting.showLocation;
};
UserSetting.prototype.getRefreshInterval = function() {
    return this.locationSetting.locationRefreshInterval;
};
UserSetting.prototype.getIcon = function() {
    return this.locIcon;
};


UserSetting.prototype.setUserLoc = function(_loc) {
    this.locationSetting.location=[_loc.coords.latitude,_loc.coords.longitude];
		console.log(this.locationSetting.location);
    this.locationSetting.locAccuracy=_loc.coords.accuracy;
    this.locationSetting.locTimestamp=_loc.timestamp;
    this.updateMarkerLoc();

};

UserSetting.prototype.setMarker = function(_marker) {
    this.marker = _marker;
};
UserSetting.prototype.getMarker = function() {
    return this.marker;
};
UserSetting.prototype.updateMarkerLoc = function() {
	    this.marker.setLatLng(this.locationSetting.location	).update();

    // this.marker = _marker;
};

UserSetting.prototype.getUserLoc = function() {
    return this.locationSetting.location;
};

UserSetting.prototype.addUserMarker = function(_map) {

};


// https://geocoin.eca.ed.ac.uk/registerUser.php

UserSetting.prototype.initialiseUser = function(){
    //check if the user has already been registered, this will be in the local storage.
    this.checkRegistration();

}

UserSetting.prototype.checkRegistration = function(){
    //check if the user has already been registered, this will be in the local storage.
    if(!localStorage.getItem("uniqueId")) {
        console.log("user is not registered.");
        $.post( "https://geocoin.eca.ed.ac.uk/registerUser.php", function( data ) {
            if(data.status=="sucess")
                localStorage.setItem("uniqueId",data.uniqueId);
            else
                console.log(data.status);
        });
        //make a call to the php page and set the uniqueId in the localstorage.
    }
    else{
        console.log("user id is: " +  localStorage.getItem("uniqueId"));
    }

}







var LeafIcon = L.Icon.extend({
	options: {
        shadowUrl: 'img/icons/userIconShadow.png',
        // iconSize:     new L.Point(50, 50),
        // shadowSize:   [50, 64],
        // iconAnchor:   new L.Point(16, 16),
        // shadowAnchor: [4, 62],
        popupAnchor:  new L.Point(16, 16)
    }
});



/*

begin

INSERT INTO locations_archive (`userId`, `longitude`, `latitude`, `accuracy`, `timeReceived`)
SELECT `userId`, `longitude`, `latitude`, `accuracy`, `timeReceived`
FROM   locations
WHERE  `userId` = uId;

DELETE from locations
WHERE  `userId` = uId;

insert into locations (`userId`,
                       `longitude`,
                       `latitude`,
                       `accuracy`,
                       `timeReceived`)
Values(uId,latitude,longitude,accuracy,timest);

end
*/
