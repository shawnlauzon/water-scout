// create a map in the "map" div, set the view to a given place and zoom
var endpoint = 'http://data.mwater.co/waterscout/apiv2/sources';

var center = new L.LatLng(-2.6, 32.9);
//var center = new L.LatLng(-1.2, 28);
var range = 0.3;
var southWest = new L.LatLng(center.lat - range, center.lng - range);
var northEast = new L.LatLng(center.lat + range, center.lng + range);
var map = L.map('map').setView(center, 6);
map.addLayer(new L.Google("HYBRID"));

var colorScale = chroma.scale(['#ccffff', '#003366']).domain([1, 7000], 500, "log")

$.getJSON("data/geoJSON.json", function(data) {
    // data is a JavaScript object now. Handle it as such
	
	L.geoJson(data, {
		style: function(feature) {
			var size = feature.properties.value;
			
			var color = colorScale(size);
//			if (size > 100) {
//				color = "#006D2C";
//			} else if (size > 50) {
//				color = "#2CA25F"
//			} else if (size > 25) {
//				color = "#6C2A4";
//			} else if (size > 10) {
//				color = "#B2E2E2";
//			} else {
//				color = "#EDF8FB";
//			}
			return { stroke: true, opacity: 0.2, color: color, fill: true, fillColor: color, fillOpacity: 0.2 };
		},
		filter: function(feature, layer) {
			return feature.properties.value >= 1;
		}
	}).addTo(map);
});

var params = "?latitude=" + southWest.lat + "," + northEast.lat + "&longitude=" + southWest.lng + "," + northEast.lng;
$.ajax({
	url : endpoint + params
}).done(function(data) {
	// loop through array
	for ( var i = 0; i < data.sources.length; i++) {
		var obj = data.sources[i];
		if (obj.latitude != null || obj.longitude != null) {

			var loc = new L.LatLng(obj.latitude, obj.longitude);
			var marker = L.circle(loc, 500, { color: '#95d0fc'}).addTo(map);

			if (obj.name != '')
				marker.bindPopup('<p>' + obj.name + '</p>');
		}
	}
});
