

function UserSetting () {
	this.layersList = {osm:['http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png','Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors']};
	this.defaultLayer=this.layersList["osm"]; 
}
 
UserSetting.prototype.getDefaultLayer = function() {
    return this.defaultLayer;
};

