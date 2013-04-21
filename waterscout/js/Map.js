// create a map in the "map" div, set the view to a given place and zoom
var endpoint = 'http://data.mwater.co/waterscout/apiv2/sources';

var center = new L.LatLng(-4.6, 32.9);
//var center = new L.LatLng(-1.2, 28);
var range = 7;
var southWest = new L.LatLng(center.lat - range, center.lng - range);
var northEast = new L.LatLng(center.lat + range, -0.9);
var map = L.map('map').setView(center, 6);
map.addLayer(new L.Google("SATELLITE"));


$.getJSON("data/rwgeoJSON.json", function(data) {
	var colorScale = chroma.scale(['#ccffff', '#003366']).domain([1, 5820], 500, "log")
    // data is a JavaScript object now. Handle it as such
	L.geoJson(data, {
		style: function(feature) {
			var size = feature.properties.value;
			
			var color = colorScale(size);
			return { stroke: true, opacity: 0.6, color: color, fill: true, fillColor: color, fillOpacity: 0.6 };
		},
		filter: function(feature, layer) {
			return feature.properties.value >= 1;
		}
	}).addTo(map);
});

$.getJSON("data/tzgeoJSON.json", function(data) {
	var colorScale = chroma.scale(['#ccffff', '#003366']).domain([1, 7000], 500, "log")
    // data is a JavaScript object now. Handle it as such
	L.geoJson(data, {
		style: function(feature) {
			var size = feature.properties.value;
			
			var color = colorScale(size);
			return { stroke: true, opacity: 0.6, color: color, fill: true, fillColor: color, fillOpacity: 0.6 };
		},
		filter: function(feature, layer) {
			return feature.properties.value >= 1;
		}
	}).addTo(map);
	
	// Do these last so that the get on top
	var params = "?latitude=" + southWest.lat + "," + northEast.lat + "&longitude=" + southWest.lng + "," + northEast.lng;
	$.ajax({
		url : endpoint + params
	}).done(function(data) {
		// loop through array
		for ( var i = 0; i < data.sources.length; i++) {
			var obj = data.sources[i];
			if (obj.latitude != null || obj.longitude != null) {

				var loc = new L.LatLng(obj.latitude, obj.longitude);
				var marker = L.circle(loc, 500, { color: '#cc3300', zIndexOffset: 1000 }).addTo(map);

				if (obj.name != '')
					marker.bindPopup('<p>' + obj.name + '</p>');
			}
		}
	});
	
});
