// create a map in the "map" div, set the view to a given place and zoom
var endpoint = 'http://data.mwater.co/waterscout/apiv2/sources';

var center = new L.LatLng(-4.6, 32.9);
//var center = new L.LatLng(-1.2, 28);
var range = 7;
var southWest = new L.LatLng(center.lat - range, center.lng - range);
var northEast = new L.LatLng(center.lat + range, -0.9);
var map = L.map('map').setView(center, 6);
map.addLayer(new L.Google("SATELLITE"));

var firstLatlng = null;
var secondLatlng = null;
var distance = null;
var clickMessage;

$.getJSON("data/rwgeoJSON.json", function(data) {
	var colorScale = chroma.scale(['white', 'red']).domain([1, 5820], 500, "log")
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
	}).on('click', function(e) { 
		if (firstLatlng === null) {
			firstLatlng = e.latlng;
			L.popup().setLatLng(e.latlng).setContent("Start building pipe").openOn(map);
			console.log(e);
			//this.bindPopup(clickMessage);
		} else {
			secondLatlng = e.latlng;
			distance = firstLatlng.distanceTo(secondLatlng);
			L.popup().setLatLng(secondLatlng).setContent("You built a pipe of " + (distance / 1000).toFixed(2) + " km").openOn(map);
			var polyline = L.polyline([firstLatlng, secondLatlng], {color: 'black'}).addTo(map);
			console.log(distance);
			firstLatlng = null;
		}
	})
	.on('close', function(e) {
		firstLatlng = null;
	}).addTo(map);
});

$.getJSON("data/tzgeoJSON.json", function(data) {
	var colorScale = chroma.scale(['white', 'red']).domain([1, 7000], 500, "log")
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
	}).on('click', function(e) { 
		if (firstLatlng === null) {
			firstLatlng = e.latlng;
			L.popup().setLatLng(e.latlng).setContent("Start building pipe").openOn(map);
			console.log(e);
			//this.bindPopup(clickMessage);
		} else {
			secondLatlng = e.latlng;
			distance = firstLatlng.distanceTo(secondLatlng);
			L.popup().setLatLng(secondLatlng).setContent("You built a pipe of " + (distance / 1000).toFixed(2) + " km").openOn(map);
			var polyline = L.polyline([firstLatlng, secondLatlng], {color: 'black'}).addTo(map);
			console.log(distance);
			firstLatlng = null;
		}
	})
	.on('close', function(e) {
		firstLatlng = null;
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
				var marker = L.circle(loc, 500, { color: 'blue', zIndexOffset: 1000 }).addTo(map);

				if (obj.name != '')
					marker.bindPopup('<p>' + obj.name + '</p>');
			}
		}
	});
});
