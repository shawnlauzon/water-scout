// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map');//.setView([51.505, -0.09], 13);
var endpoint = 'http://data.mwater.co/waterscout/apiv2/sources';

// add an OpenStreetMap tile layer
//L.tileLayer('http://tile.osmosnimki.ru/basesat/{z}/{x}/{y}.jpg', {}).addTo(map);
//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}).addTo(map);
//map.addLayer(new L.Google());
L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);


// current location
map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
	var radius = e.accuracy / 2;

	L.marker(e.latlng).addTo(map)
		.bindPopup("You are within " + radius + " meters from this point").openPopup();

	L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
	alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);


// jquery ajax
$.ajax({ url: endpoint}).done(function( data ) {
  // loop threw array
  console.log( data );
  for(var i=0; i < data.sources.length; i++)
  {
  	var obj = data.sources[i];
  	if(obj.latitude != null || obj.longitude != null)
  	{

  		var loc = new L.LatLng(obj.latitude, obj.longitude);
  		L.marker( loc ).addTo(map);

  	}

  }
});