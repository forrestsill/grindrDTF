$(document).ready(function() {
  getLocation();

});

function getLocation() {
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});

    function success(pos) {
      $("#finding-loc").text(pos.coords.latitude + ", " + pos.coords.longitude);
    }

    function fail(error) {
      $("#finding-loc").text(error);
      showLocSearch();
    }

  } else {
    console.log("no");
  }
}

function showLocSearch() {
  // TODO: show form div

}

function geocodeAddress(geocoder, resultsMap) {
  var userEntry = $("#loc-input").val();
  geocoder.geocode({'address' : userEntry}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      setMapOnAll(null);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      alert("Geocode unsuccessful: " + status);
    }
  });
}

function initMap() {
  var map = new google.maps.Map(document.getElementById("map-canvas"), {
          zoom: 14,
          center: {lat: 40.7412, lng: -74.006717}
        });
  var geocoder = new google.maps.Geocoder();
  document.getElementById("loc-search-submit").addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });
}

function clearMarkers() {
  setMapOnAll(null);
}
