var map = L.map('map').setView([41.25, -95.99], 12);
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'Positron'
  }).addTo(map);

var parks = L.esri.featureLayer({
  url: "https://gis.dogis.org/arcgis/rest/services/Parks/Parks_Outline/MapServer/0",
  style: function () {
    return { color: "#70ca49", weight: 2 };
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
    return { color: "black", weight: 3 };
  }
}).addTo(map);

// Park popup information
var popupTemplate = "<h3>{NAME}</h3><br><small>Address: {FULLADDR}<small>";

parks.bindPopup(function(e){
  return L.Util.template(popupTemplate, e.feature.properties)
});

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


// Helper functions

// Add geolocate plugin
L.control.locate().addTo(map);

// Checkbox input for trails
// add the event handler
function handleCommand() {
   alert("Clicked, checked = " + this.checked);
}

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
