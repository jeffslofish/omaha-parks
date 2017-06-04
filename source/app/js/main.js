var map = L.map('map').setView([41.25, -95.99], 12);
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'Positron'
  }).addTo(map);

var parks = L.esri.featureLayer({
  url: "https://gis.dogis.org/arcgis/rest/services/Parks/Parks_Outline/MapServer/0",
  style: function () {
    return { color: "#afe7ae", 
    weight: 0, 
    fillOpacity: 0.75 };
  }
}).addTo(map);

var playgrounds = L.esri.featureLayer({
  url: "https://gis.dogis.org/arcgis/rest/services/Parks/Parks_Asset_Collector_Project/FeatureServer/3",
  style: function () {
    return { color: "red", weight: 2 };
  }
}).addTo(map);

var courts = L.esri.featureLayer({
  url: "https://gis.dogis.org/arcgis/rest/services/Parks/Parks_Asset_Collector_Project/FeatureServer/1",
  pointToLayer: function (geojson, latlng) {
      return L.circleMarker(latlng, {
        radius: 3,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });
    }
}).addTo(map);

var biketrails = L.esri.featureLayer({
  url: "https://gis.dogis.org/arcgis/rest/services/Bike_Trails_and_Routes/MapServer/3",
  style: function () {
    return { color: "#333", weight: 2 };
  }
});

var communityGardensLayer = L.esri.featureLayer({
  url: "https://gis.dogis.org/arcgis/rest/services/DC_Health/Gardens_and_Markets/MapServer/0",
  pointToLayer: function (geojson, latlng) {
      return L.circleMarker(latlng, {
        radius: 3,
        fillColor: "steelblue",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });
    }
});


// Park popup information
var popupTemplate = "<h3>{NAME}</h3><br><small>Address: {FULLADDR}<small>";
var popupTemplateCourts = "<h3>{NAME}</h3><br><small>Court type: {SPORT}<small>";

parks.bindPopup(function(e){
  return L.Util.template(popupTemplate, e.feature.properties)
});
courts.bindPopup(function(e){
  return L.Util.template(popupTemplateCourts, e.feature.properties)
})

// collect geometries into an object so we can reference them later
  var geometries = {
    polygon: parks,
  };

   // get references to our <select> elements
  var relationship = document.getElementById('relationSelect');
  var geometry = document.getElementById('geometrySelect');

  var previousIds = [];

// Legend
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["Park", "Playground", "Play Structure"],
        labels = ["Park","Playground","Play Structure"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            grades[i] + " - " + labels[i] + "</br>";
    }

    return div;
};

legend.addTo(map);


// Helper functions -----------------------------------------------------------------

// Add geolocate plugin
L.control.locate().addTo(map);

// ------------------------
// Toggle features on and off
// ------------------------
var biketrailstoggle = document.getElementById("bikingtrails");
    
// listen for the 'change' event on the checkbox and toggle the layer on and off
biketrailstoggle.addEventListener('change', function(e){
  if(biketrailstoggle.checked){
    biketrails.addTo(map);
  } else {
    map.removeLayer(biketrails);
  }
});

var communitygardenstoggle = document.getElementById("communitygardens");
    
// listen for the 'change' event on the checkbox and toggle the layer on and off
communitygardenstoggle.addEventListener('change', function(e){
  if(communitygardenstoggle.checked){
    communityGardensLayer.addTo(map);
  } else {
    map.removeLayer(communityGardensLayer);
  }
});

// FIXME: For some reason once you uncheck parks, if you check them again, they won't appear in the map
var parkstoggle = document.getElementById("parks");

// listen for the 'change' event on the checkbox and toggle the layer on and off
parkstoggle.addEventListener('change', function(e){
  if(parkstoggle.checked){
    parks.addTo(map);
  } else {
    map.removeLayer(parks);
  }
});

var playgroundstoggle = document.getElementById("playgrounds");

// listen for the 'change' event on the checkbox and toggle the layer on and off
playgroundstoggle.addEventListener('change', function(e){
  if(playgroundstoggle.checked){
    playgrounds.addTo(map);
  } else {
    map.removeLayer(playgrounds);
  }
});

var courtstoggle = document.getElementById("courts");

// listen for the 'change' event on the checkbox and toggle the layer on and off
courtstoggle.addEventListener('change', function(e){
  if(courtstoggle.checked){
    courts.addTo(map);
  } else {
    map.removeLayer(courts);
  }
});

// TODO: Add walking trails toggle

// ------------------------
// Esri spatial queries
// ------------------------

/* TODO: Re-enable this code after "geometry" is defined (it was causing a javascript error).
// reset all features back to their regularly defined styles
  function reset(){
    for (var i = previousIds.length - 1; i >= 0; i--) {
      parks.resetStyle(previousIds[i]);
    };
  }

  // query the API and highlight features
  function query(){
    reset();

    // lookup our input geometry
    var inputGeometry = geometries[geometry.value];

    // query the service executing the selected relation with the selected input geometry
    parks.query()[relationship.value](inputGeometry).ids(function(error, ids){
      previousIds = ids;
      for (var i = ids.length - 1; i >= 0; i--) {
        parks.setFeatureStyle(ids[i], { color: '#70ca49', weight: 2 });
      };
    });
  }

  // query when an input changes
  geometry.addEventListener('change', query);
  relationship.addEventListener('change', query);

  // once all parks have loaded run the default query
  parks.once('load', function(){
    query();
  });
*/