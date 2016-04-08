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



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updateUserLcation);
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
