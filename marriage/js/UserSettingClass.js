/*
*/

function UserSettingClass () {
	this.layersList = {osm:['http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png','Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors']};
	this.defaultLayer = this.layersList["osm"];
	this.pulsingBlue = L.icon.pulse({iconSize:[10,10],color:"rgb(100,100,250)"});
	this.partners = [];
	this.marriageZone=0;
	this.marries="";
	this.marriedList=[];
	this.checkUserName=true;
	this.partnersTogether=false;
	this.is_married=false;
	this.userInMarriageZone=false;
	this.locationSetting = {
		showLocation:true,
		locationRefreshInterval:5000,
		followUser:true,//this means when the user locaiton moves, always keep the user in the centre of the map.
		location:[55.945925800000005, -3.2005949],
		locAccuracy:0,
		locTimestamp:0
	};
	this.locIcon = new LeafIcon({iconUrl: 'img/icons/userIcon.png'});
	this.marker = L.marker([51.3, 0.7], {icon: this.pulsingBlue});
	// this.marker.style.zIndex =999;
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
	if(!g_debugMode){
		this.locationSetting.location=[_loc.coords.latitude,_loc.coords.longitude];
		this.locationSetting.locAccuracy=_loc.coords.accuracy;
		this.locationSetting.locTimestamp=_loc.timestamp;
		this.dbUpdateLocation();//updates the current locaiton on server
		this.updateMarkerLoc();
		this.getNewBalabce();
	}
	else{
		this.locationSetting.location=[_loc.lat,_loc.lng];
		this.locationSetting.locAccuracy=15;
		this.locationSetting.locTimestamp=Date.now();
		this.dbUpdateLocation();//updates the current locaiton on server
		this.updateMarkerLoc();
		this.getNewBalabce();
	}
};

//updating users locaiton in the database. the stored procedure will first archive previous position in locations_archive and then adds the new location.
UserSettingClass.prototype.dbUpdateLocation=function(){
	var postUrl = g_baseURL+"updateLocation.php";
	var inputs =  { userId:this.getId(),
		longitude:this.locationSetting.location[1],
		latitude:this.locationSetting.location[0],
		accuracy:Math.floor(this.locationSetting.locAccuracy),
		timeReceived:this.locationSetting.locTimestamp
	};
	$.post( postUrl,inputs, function( data ) {
	});
}

UserSettingClass.prototype.getNewBalabce = function(_marker) {
	// console.log("in There!!");
	var postUrl = g_baseURL+"getUserBalance.php";
	var uId=this.getUserId();
	if(this.is_married)
	uId=this.getMarriageUserId();
	var inputs =  { userId:uId};
	// console.log(inputs);
	$.post( postUrl,inputs).always(function(data) {
		console.log(data[0].balance);
		var res = data[0].balance.split("&");
		$("#balanceText").html("Confirmed&nbsp&nbsp&nbsp&nbsp:&nbsp"+res[0] + "&nbsp mBTC"+ "<br> Unconfirmed&nbsp:&nbsp" +  res[1] + "&nbsp mBTC");
	});
};

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
	if(this.checkUserName){
		this.checkRegistration();

		// var passwords = ["henri","occupant_1","occupant_2","occupant_3","occupant_4","occupant_5","occupant_6","occupant_7","occupant_8","occupant_9","occupant_10","occupant_11","occupant_12","occupant_13","occupant_14","occupant_15"]
		this.getNewBalabce();
	}
	else{
		localStorage.setItem("userName","henri");
		localStorage.setItem("id",54);
		localStorage.setItem("walletName","default_wallet");
		this.getNewBalabce();
	}
}


UserSettingClass.prototype.checkRegistration = function(){
	//check if the user has already been registered, this will be in the local storage.
	if(!localStorage.getItem("userName")) {
		$("#login").show("slow");
	}
	else{
		var url = g_baseURL+"checkUserExists.php";
		var inputs = {"uId":this.getUserId()};
		var self=this;
		$.post( url,inputs).always(function(data) {
			if(data.status=="sucess"){
				if(data.count===0){
					localStorage.clear();
					self.checkRegistration();
				}
			}
		});
		$("#user").html('<img src="img/icons/personRed.png" class="balanceIcons"/>'+"<strong> " + this.getUserName() +"</strong>");
	}
}

UserSettingClass.prototype.getUserId = function(){
	return localStorage.getItem("id");
}
UserSettingClass.prototype.getUserName = function(){
	return localStorage.getItem("userName");
}
UserSettingClass.prototype.getId = function(){
	return localStorage.getItem("id");
}

var g_partners=[];
//get list of partners with their location and then check if the user is married.
UserSettingClass.prototype.updatePartners = function(){
	var postUrl = g_baseURL+"getPartners.php";
	var inputs =  {"uId":this.getUserId()};
	var self=this;
	$.post( postUrl,inputs).always(function(data) {
		self.partners = data.userIds;
		self.checkIfMarried();
	});
}
g_firstTime=true;
var g_prevMarriageStat=false;
UserSettingClass.prototype.checkIfMarried= function(){
	var partner="";
	this.marries="";

	window.g_prevMarriageStat=this.is_married;
	this.is_married=false;
	$( ".spouseDetails" ).remove();
	for(var i = 0 ; i<this.partners.length;i++){
		partner = this.partners[i];
		if (this.getUserId() !== partner.userId){
			this.is_married=true;
			this.loadMarriageUserId();

			$("#balance").before('<tr class="spouseDetails"> <td class="spouseIcon"><img src="img/icons/personGrey.png" class="balanceIcons"/></td><td class="spouseName">your spouse  <strong>'+ partner.userName +'</strong></td></tr>')
			this.marries +=partner.userName +", ";
		}
	}
	if(!this.is_married){
		{if(window.g_prevMarriageStat){
			$("#youCollected").text("You have been divorced!").show(0);
			setTimeout(function(){
				localStorage.clear();
				$("#youCollected").hide(0);
				$( ".spouseDetails" ).remove();
				$("#user").html('<img src="img/icons/personRed.png" class="balanceIcons"/>'+"<strong> " + g_user.getUserName()+"</strong>");
				g_user.checkRegistration();
				g_user.getNewBalabce();},5000)
			}
		}
	}
	if(this.is_married){
		if(g_firstTime){
			g_snd.play();
			// 		$("#love").show().delay(30000).queue(function(n) {
			// 			$(this).hide(); n();
			// });
			// 		// $("#marriedTo").text("Married to: "+this.marries);
			g_firstTime=false;
		}
		this.marriedList=this.partners;
	}
	else {
		this.marriedList=[];
	}
	this.checkIfTogether();
	if(this.is_married){
		$("#marriageBut").attr('value', 'Divorce!');
		$("#bitcoinIcon").attr("src", "img/icons/double_bitcoin.png");
	}
	else
	{
		$("#marriageBut").attr('value', 'Get Married');
		$("#bitcoinIcon").attr("src", "img/icons/single_bitcoin.png");}
		return this.is_married;
	}


	UserSettingClass.prototype.checkIfTogether= function(){
		var partner1,partner2,distanceToPartner=0;
		this.partnersTogether=true;
		for(var i = 0 ; i<this.marriedList.length-1;i++){
			partner1 = this.marriedList[i];
			partner2 = this.marriedList[i+1];
			distanceToPartner=getDistance( partner1.latitude,partner1.longitude, partner2.latitude,partner2.longitude);
			if(distanceToPartner<30/1000){
				this.partnersTogether &=true;
			}else{this.partnersTogether=false;}
		}
		//now check against this user
		for(var i = 0 ; i<this.marriedList.length;i++){
			partner2 = this.marriedList[i];
			distanceToPartner=getDistance( this.locationSetting.location[0],this.locationSetting.location[1], partner2.latitude,partner2.longitude);
			if(distanceToPartner<30/1000){
				this.partnersTogether &=true;
			}else{this.partnersTogether=false;}
		}
	}


	UserSettingClass.prototype.loadMarriageUserId=function(){
		var postUrl = g_baseURL+"getMarriageWallet.php";
		var inputs =  {"uId":this.getUserId()};
		var self=this;
		$.post( postUrl,inputs).always(function(data) {
			if(data.status==="sucess"){
				localStorage.setItem("marriageWallet",data.walletName);
				localStorage.setItem("marriageId",data.marriageId);
			}
		});
	}
	UserSettingClass.prototype.getMarriageUserId=function(){
		return localStorage.getItem("marriageId");
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
