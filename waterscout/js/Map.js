// create a map in the "map" div, set the view to a given place and zoom
var endpoint = 'http://data.mwater.co/waterscout/apiv2/sources';

var center = new L.LatLng(-2.6, 32.9);
//var center = new L.LatLng(-1.2, 28);
var range = 0.3;
var southWest = new L.LatLng(center.lat - range, center.lng - range);
var northEast = new L.LatLng(center.lat + range, center.lng + range);
var map = L.map('map').setView(center, 11);
map.addLayer(new L.Google("HYBRID"));

// add an OpenStreetMap tile layer
//L.tileLayer('http://tile.osmosnimki.ru/basesat/{z}/{x}/{y}.jpg', {}).addTo(map);
//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(map);

// current location
//map.locate({setView: true, maxZoom: 14});

var geojsonMarkerOptions = {
		cellSize: 0.0083333333333,
	    fillColor: "#ff7800",
	    weight: 1,
	    stroke: false,
	    fillOpacity: 0.2
	};

var latlng2;
var bounds;

$.getJSON("data/geoJSON.json", function(data) {
    // data is a JavaScript object now. Handle it as such
	
	L.geoJson(data, {
		style: function(feature) {
			var size = feature.properties.value;
			var color;
			if (size > 100) {
				color = "#006D2C";
			} else if (size > 50) {
				color = "#2CA25F"
			} else if (size > 25) {
				color = "#6C2A4";
			} else if (size > 10) {
				color = "#B2E2E2";
			} else {
				color = "#EDF8FB";
			}
			return { stroke: true, opacity: 0.3, color: color, fill: true, fillColor: color };
		},
		filter: function(feature, layer) {
			return feature.properties.value > 0;
		}
	}).addTo(map);
	
//	L.geoJson(data, {
//		pointToLayer: function(feature, latlng) {
//			var northEast = new L.LatLng(latlng.lat + geojsonMarkerOptions.cellSize, latlng.lng + geojsonMarkerOptions.cellSize);
//			var bounds = new L.LatLngBounds(latlng, northEast);
//			
//			var size = feature.properties.value;
//			var fillColor;
//			if (size > 100) {
//				fillColor = "#006D2C";
//			} else if (size > 50) {
//				fillColor = "#2CA25F"
//			} else if (size > 25) {
//				fillColor = "#6C2A4";
//			} else if (size > 10) {
//				fillColor = "#B2E2E2";
//			} else {
//				fillColor = "#EDF8FB";
//			}
//			return L.rectangle(bounds, { weight: 1, fillColor: fillColor, fill: true, fillOpacity: 0.5});
//		},
		
//		style: function(feature) {
//			var size = feature.properties.value;
//			var fillColor;
//			if (size > 100) {
//				fillColor = "#006D2C";
//			} else if (size > 50) {
//				fillColor = "#2CA25F"
//			} else if (size > 25) {
//				fillColor = "#6C2A4";
//			} else if (size > 10) {
//				fillColor = "#B2E2E2";
//			} else {
//				fillColor = "#EDF8FB";
//			}
//			return { stroke: false, fill: true, fillColor: fillColor, fillOpacity: 0.5 };
//		},
//		
//		filter: function(feature, layer) {
//			console.log(feature.properties.value)
//			return feature.properties.value > 0;
//		}
//		
//	}).addTo(map);
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
