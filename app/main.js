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

var playgrounds = L.esri.featureLayer({
  url: "https://gis.dogis.org/arcgis/rest/services/Parks/Parks_Asset_Collector_Project/FeatureServer/2",
  style: function () {
    return { color: "black", weight: 2 };
  }
}).addTo(map);

// Park popup information
var popupTemplate = "<h3>{NAME}</h3><br><small>Address: {FULLADDR}<small>";

parks.bindPopup(function(e){
  return L.Util.template(popupTemplate, e.feature.properties)
});


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["Park", "Playground", "Play Structure"],
        labels = ["Park","Playground","Play Structure"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            grades[i] +'<br>';
    }

    return div;
};

legend.addTo(map);
