$(document).ready(function() {


});

function listResults(loc) {
  $.getJSON("chicago_clinics.json", function(data){
    var clinics = data['clinics'];
    $(clinics).each(function(i, d) {
      $("#list-container").append("<div class='float-left'>\
        <div class='clinic-container'>\
          <div class='name-container'>\
            <span class='ordinal'>" + (i + 1) + ". </span><span class='clinic-name'>Clinic name</span>\
          </div>\
          <div class='address-container'>\
            <span class='address'>Address</span>\
          </div>\
          <div class='appt-container'>\
            <span class='appt-text'>Next availible appt text.</span>\
        </div>\
      </div>\
    </div>\
    <div class='float-right'>\
      <div class='icon-container'>\
        <img src='http://placehold.it/70x70' alt''>\
      </div>\
      <div class='dist-container'>\
        <span class='dist'>distance</div>\
      </div>")
    });
  });
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
      console.log(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
      listResults(results[0].geometry.location);
    } else {
      alert("Geocode unsuccessful: " + status);
    }
  });
}

function geocodeCurrentLoc(geocoder, resultsMap, currentLoc) {
  var marker = new google.maps.Marker({
      map: resultsMap,
      position: currentLoc
  });
  google.maps.event.trigger(resultsMap, 'resize');
  resultsMap.setCenter(currentLoc);
  listResults(currentLoc);
}

function initMap() {
  var map = new google.maps.Map(document.getElementById("map-canvas"), {
          zoom: 14,
          center: {lat: 40.7412, lng: -74.006717}
        });
  var geocoder = new google.maps.Geocoder();
  $("#loc-search-submit").on('click', function() {
    geocodeAddress(geocoder, map);
    $("#map-canvas").css("display", "block");
  });
  $("#loc-input").keypress(function (e) {
    if (e.which == 13) {
      geocodeAddress(geocoder, map);
      $("#map-canvas").css("display", "block");
    }
  });

  if (navigator.geolocation) {


    var currentLoc = navigator.geolocation.getCurrentPosition(success, fail);

    console.log(currentLoc);

    function success(pos) {
      $("#finding-loc").css("display", "none");
      geocodeCurrentLoc(geocoder, map, new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude));

      $("#map-canvas").css("display", "block");

    }

    function fail(error) {
      showLocSearch();
    }

  } else {
    showLocSearch();
  }
}
