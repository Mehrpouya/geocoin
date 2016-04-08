/*

*/

function UserSettingClass () {
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
UserSettingClass.prototype.getDefaultLayer = function() {
    return this.defaultLayer;
};

UserSettingClass.prototype.getShowLocation = function() {
    return this.locationSetting.showLocation;
};
UserSettingClass.prototype.getRefreshInterval = function() {
    return this.locationSetting.locationRefreshInterval;
};
UserSettingClass.prototype.getIcon = function() {
    return this.locIcon;
};


UserSettingClass.prototype.setUserLoc = function(_loc) {

    this.locationSetting.location=[_loc.coords.latitude,_loc.coords.longitude];
		console.log(this.locationSetting.location);
    this.locationSetting.locAccuracy=_loc.coords.accuracy;
    this.locationSetting.locTimestamp=_loc.timestamp;
		this.dbUpdateLocation();//updates the current locaiton on server
    this.updateMarkerLoc();

};

//updating users locaiton in the database. the stored procedure will first archive previous position in locations_archive and then adds the new location.
UserSettingClass.prototype.dbUpdateLocation=function(){
	var postUrl = "http://geocoin.eca.ed.ac.uk/updateLocation.php";
	var inputs =  { uniqueId:this.getUserId(),
									longitude:this.locationSetting.location[1],
									latitude:this.locationSetting.location[0],
									accuracy:Math.floor(this.locationSetting.locAccuracy),
									timeReceived:this.locationSetting.locTimestamp
								};
	console.log(inputs);

	$.post( postUrl,inputs, function( data ) {
			if(data.status=="sucess")
					console.log("date is " + data);
			else
					console.log(data.status);
	}).fail(function(data){
		console.log(data);
	});
}

UserSettingClass.prototype.setMarker = function(_marker) {
    this.marker = _marker;
};
UserSettingClass.prototype.getMarker = function() {
    return this.marker;
};
UserSettingClass.prototype.updateMarkerLoc = function() {
	    this.marker.setLatLng(this.locationSetting.location	).update();

    // this.marker = _marker;
};

UserSettingClass.prototype.getUserLoc = function() {
    return this.locationSetting.location;
};

UserSettingClass.prototype.getUserLat = function() {
    return this.locationSetting.location[0];
};
UserSettingClass.prototype.getUserLon = function() {
    return this.locationSetting.location[1];
};


UserSettingClass.prototype.addUserMarker = function(_map) {

};


// https://geocoin.eca.ed.ac.uk/registerUser.php

UserSettingClass.prototype.initialiseUser = function(){
    //check if the user has already been registered, this will be in the local storage.
    this.checkRegistration();

}


UserSettingClass.prototype.checkRegistration = function(){
    //check if the user has already been registered, this will be in the local storage.
    if(!localStorage.getItem("uniqueId")) {
        console.log("user is not registered.");
        $.post( "http://geocoin.eca.ed.ac.uk/registerUser.php", function( data ) {
            if(data.status=="sucess"){
                localStorage.setItem("uniqueId",data.uniqueId);
								console.log(data.uniqueId);}
            else
                console.log(data.status);
        });
        //make a call to the php page and set the uniqueId in the localstorage.
    }
		else{
			console.log("user is: " + this.getUserId() );
		}
}

UserSettingClass.prototype.getUserId = function(){
	return localStorage.getItem("uniqueId");
}









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
