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

      var popupTemplate = "<h3>{NAME}</h3><br><small>Days: {OPERDAYS}<small>";

      parks.bindPopup(function(e){
        return L.Util.template(popupTemplate, e.feature.properties)
      });