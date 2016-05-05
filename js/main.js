$(document).ready(function() {


});



function getLocation() {

}

function showLocSearch() {
  $("#finding-loc").css("display", "none");
  $(".location-entry").css("display", "block");
}

function geocodeAddress(geocoder, resultsMap) {
  var userEntry = $("#loc-input").val();
  geocoder.geocode({'address' : userEntry}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);

      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      alert("Geocode unsuccessful: " + status);
    }
  });
}

function geocodeCurrentLoc(geocoder, resultsMap, currentLoc) {
  resultsMap.setCenter(currentLoc);
  var marker = new google.maps.Marker({
      map: resultsMap,
      position: currentLoc
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
    $("#map-canvas").show();
  });

  if (navigator.geolocation) {


    var currentLoc = navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});

      console.log(currentLoc);

    function success(pos) {
      $("#finding-loc").css("display", "none");
      geocodeCurrentLoc(geocoder, map, currentLoc);
      //$("#finding-loc").text(pos.coords.latitude + ", " + pos.coords.longitude);
      $("#map-canvas").show();
    }

    function fail(error) {
      //$("#finding-loc").text(error);
      showLocSearch();
    }

  } else {
    showLocSearch();
  }
}
