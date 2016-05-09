$(document).ready(function () {


});

function listResults(loc, resultsMap) {
  $.getJSON("chicago_clinics.json", function (data) {
    var clinics = data['clinics'];
    $(clinics).each(function (i, d) {
      var icon = "";
      if (d['type'] == "hospital") {
        icon = "hospital.png";
      } else if (d['type'] == "planned-parenthood") {
        icon = "pp.png";
      } else {
        icon = "clinic.png";
      }
      var testDate = new Date("2016-05-08T00:00:00");
      $("#list-container").append("<hr><div class='" + " clinic-container clinic-container-" + i + "'>\
        <div class='float-left'>\
          <div class='name-container'>\
            <span class='ordinal'>" + (i + 1) + ". </span><span class='clinic-name'>" + d['name'] + "</span>\
          </div>\
          <div class='address-container'>\
            <span class='address'>" + d['address'] + "</span>\
          </div>\
          <div class='appt-container'>\
            <span class='appt-text' " + aiSecretary(testDate, d['appts']) + "</span>\
          </div>\
      </div>\
    <div class='float-right'>\
      <div class='icon-container'>\
        <img src='" + icon + "' height='40px' alt='clinic type'>\
      </div>\
        <div class='dist-container'>\
          <span class='dist-text'></span>\
        </div>\
    </div>");
      getDist(loc, d['address'], i, resultsMap);
      $(".clinic-container-" + i).click(function () {
        $(".times").hide();
        var buttons = "";
        $(d['appts']).each(function (i, t) {
          var date = new Date(t);
          buttons += ("<button type='button' class='time btn btn-info'>" + moment(date).format('dddd, MMMM Do, h:mm A') + "</button>");
        });
        if (buttons.length == 0)
          buttons = "No availible appointments.";
        $(this).after("<div class='times'>" + buttons + "</div>");
      });
    });
  });
  $("footer").show()
}

function getDist(currentLoc, clinicAddress, i, resultsMap) {
  new google.maps.Geocoder().geocode({
    'address': clinicAddress
  }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {

      var marker = new google.maps.Marker({
        position: results[0].geometry.location,
        label: i + 1 + "",
        map: resultsMap

      });
      //marker.addListener('click', toggleBounce);

      var service = new google.maps.DistanceMatrixService();
      return service.getDistanceMatrix({
        origins: [results[0].geometry.location],
        destinations: [currentLoc],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
      }, function (response, status) {
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
  geocoder.geocode({
    'address': userEntry
  }, function (results, status) {
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
    center: {
      lat: 40.7412,
      lng: -74.006717
    }
  });
  var geocoder = new google.maps.Geocoder();
  $("#loc-search-submit").on('click', function () {
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
      geocodeCurrentLoc(geocoder, map, new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    }

    function fail(error) {
      showLocSearch();
    }

  } else {
    showLocSearch();
  }
}

function jsonToObj(jsonString) {
  if (jsonString === undefined) {
    return undefined;
  }
  return JSON.parse(jsonString);
}

function getAppointments(clinicsObj, clinicName) {
  var clinic;

  for (var i = 0; i < clinicsObj["clinics"].length; i++) {
    clinic = clinicsObj["clinics"][i];
    if (clinic["name"].toUpperCase() === clinicName.toUpperCase()) {
      return clinic["appts"];
    }
  }
  return undefined;
}

function countWithinHour(currentDate, appts) {
  var ONE_HOUR = 60 * 60 * 1000;
  var thisAppt;
  var count = 0;

  for (i = 0; i < appts.length; i++) {
    thisAppt = new Date(appts[i]);
    if (thisAppt > currentDate && thisAppt - currentDate <= ONE_HOUR) {
      count++;
    }
  }
  return count;
}

function countWithin24Hours(currentDate, appts) {
  var ONE_DAY = 24 * 60 * 60 * 1000;
  var thisAppt;
  var count = 0;

  for (i = 0; i < appts.length; i++) {
    thisAppt = new Date(appts[i]);
    if (thisAppt > currentDate && thisAppt - currentDate <= ONE_DAY) {
      count++;
    }
  }
  return count;
}

function countWithinWeek(currentDate, appts) {
  var ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  var thisAppt;
  var count = 0;

  for (i = 0; i < appts.length; i++) {
    thisAppt = new Date(appts[i]);
    if (thisAppt > currentDate && thisAppt - currentDate <= ONE_WEEK) {
      count++;
    }
  }
  return count;
}

function countWithinMonth(currentDate, appts) {
  var ONE_MONTH = 31 * 24 * 60 * 60 * 1000;
  var thisAppt;
  var count = 0;

  for (i = 0; i < appts.length; i++) {
    thisAppt = new Date(appts[i]);
    if (thisAppt > currentDate && thisAppt - currentDate <= ONE_MONTH) {
      count++;
    }
  }
  return count;
}

function aiSecretary(currentDate, appts) {
  var apptStr = "s";
  var withinHour = countWithinHour(currentDate, appts);
  if (withinHour > 0) {
    if (withinHour === 1) {
      apptStr = "";
    }
    return ">" + withinHour + " appointment" + apptStr + " available within an hour."
  }
  var within24 = countWithin24Hours(currentDate, appts);
  if (within24 > 0) {
    if (within24 === 1) {
      apptStr = "";
    }
    return ">" + within24 + " appointment" + apptStr + " available within 24 hours."
  }
  var withinWeek = countWithinWeek(currentDate, appts);
  if (withinWeek > 0) {
    if (withinWeek === 1) {
      apptStr = "";
    }
    return ">" + withinWeek + " appointment" + apptStr + " available within a week."
  }
  var withinMonth = countWithinMonth(currentDate, appts);
  if (withinMonth > 0) {
    if (withinMonth === 1) {
      apptStr = "";
    }
    return ">" + withinMonth + " appointment" + apptStr + " available within a month."
  }
  return "style=color:red>No appointments available soon."
}