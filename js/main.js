$(document).ready(function() {


});

function listResults(loc, resultsMap) {
  $.getJSON("chicago_clinics.json", function(data){
    var clinics = data['clinics'];
    $(clinics).each(function(i, d) {
      $("#list-container").append("<hr><div class='" + " clinic-container clinic-container-" + i + "'>\
        <div class='float-left'>\
          <div class='name-container'>\
            <span class='ordinal'>" + (i + 1) + ". </span><span class='clinic-name'>" + d['name'] + "</span>\
          </div>\
          <div class='address-container'>\
            <span class='address'>" + d['address'] + "</span>\
          </div>\
          <div class='appt-container'>\
            <span class='appt-text'>Next availible appt text.</span>\
          </div>\
      </div>\
    <div class='float-right'>\
      <div class='icon-container'>\
        <img src='http://placehold.it/70x70' alt''>\
      </div>\
        <div class='dist-container'>\
          <span class='dist-text'></span>\
        </div>\
    </div>");
      getDist(loc, d['address'], i, resultsMap);
    });
  });
  $("footer").show();
}

function getDist(currentLoc, clinicAddress, i, resultsMap) {
  new google.maps.Geocoder().geocode({'address' : clinicAddress}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {

      var marker = new google.maps.Marker({
          position: results[0].geometry.location,
          label: i + 1 + "",
          map: resultsMap

      });
      //marker.addListener('click', toggleBounce);

      var service = new google.maps.DistanceMatrixService();
      return service.getDistanceMatrix(
        {
          origins: [results[0].geometry.location],
          destinations: [currentLoc],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL
        }, function(response, status) {
          $(".clinic-container-" + i + ">.float-right>.dist-container>.dist-text").text(response['rows'][0]['elements'][0]['distance']['text']);
        });
    } else {
      alert("Geocode unsuccessful: " + status);
    }
  })
}

function showLocSearch() {
  $("#finding-loc").css("display", "none");
  $(".location-entry").css("display", "flex");
}

function geocodeAddress(geocoder, resultsMap) {
  var userEntry = $("#loc-input").val();
  geocoder.geocode({'address' : userEntry}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      $("#map-canvas").css('visibility', 'visible');
      listResults(results[0].geometry.location, resultsMap);
    } else {
      alert("Geocode unsuccessful: " + status);
    }
  });
}

function geocodeCurrentLoc(geocoder, resultsMap, currentLoc) {
  resultsMap.setCenter(currentLoc);
  $("#map-canvas").css('visibility', 'visible');
  listResults(currentLoc, resultsMap);
}

function initMap() {
  var map = new google.maps.Map(document.getElementById("map-canvas"), {
          zoom: 14,
          center: {lat: 40.7412, lng: -74.006717}
        });
  var geocoder = new google.maps.Geocoder();
  $("#loc-search-submit").on('click', function() {
    geocodeAddress(geocoder, map);
  });
  $("#loc-input").keypress(function (e) {
    if (e.which == 13) {
      geocodeAddress(geocoder, map);
    }
  });

  if (navigator.geolocation) {

    var currentLoc = navigator.geolocation.getCurrentPosition(success, fail);

    function success(pos) {
      $("#finding-loc").css("display", "none");
      geocodeCurrentLoc(geocoder, map, new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude));
    }

    function fail(error) {
      showLocSearch();
    }

  } else {
    showLocSearch();
  }
}
