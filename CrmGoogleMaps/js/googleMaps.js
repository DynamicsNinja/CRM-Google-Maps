var lat = [];
var lng = [];
var useGoogleAddress = false;
var markerIcon = "";
var map;
var addressProcessedCounter = 0;
var addresses = [];
var defaultZoom = null;

function initialize() {
    var p = GetParameters();
    var map_canvas = document.getElementById('map_canvas');
    var map_options = {
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(map_canvas, map_options);
    addresses = p.address.split(',');
    if (p.zoom != undefined) { defaultZoom = parseInt(p.zoom); }
    $.each(addresses, function (index, value) {
        var addressString = generateAddressString(value);
        setMarker(addressString);
    });
}

function generateAddressString(field) {
    var addressString = [];
    if (field.indexOf('+') !== -1) {
        var fields = field.split('+');
        $.each(fields, function (index, value) {
            var fieldValue = window.parent.Xrm.Page.data.entity.attributes.get(value).getValue();
            if (fieldValue != null) {
                addressString.push(fieldValue);
            }
        });
        return addressString.join();
    } else {
        return window.parent.Xrm.Page.data.entity.attributes.get(field).getValue();;
    }
}

function setCenterAndZoom() {
    map.setCenter(new google.maps.LatLng(
        ((Math.max.apply(Math, lat) + Math.min.apply(Math, lat)) / 2.0), ((Math.max.apply(Math, lng) + Math.min.apply(Math, lng)) / 2.0)));
    if (addresses.length == 1) {
        map.setZoom(defaultZoom);
    } else {
        map.fitBounds(new google.maps.LatLngBounds(
            //bottom left
            new google.maps.LatLng(Math.min.apply(Math, lat), Math.min.apply(Math, lng)),
            //top right
            new google.maps.LatLng(Math.max.apply(Math, lat), Math.max.apply(Math, lng))));
    }
}

function setMarker(address) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    },

        function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $("#map_canvas").show();
                addressProcessedCounter++;
                lat.push(results[0].geometry.location.lat());
                lng.push(results[0].geometry.location.lng());

                if (addressProcessedCounter == addresses.length) {
                    setCenterAndZoom(map);
                }
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    title: useGoogleAddress ? results[0].formatted_address : address,
                    icon: markerIcon
                });
                google.maps.event.addListener(marker,
                    'click',
                    function () {
                        var infowindow = new google.maps.InfoWindow({
                            content: marker.title,
                            position: marker.position,
                        });
                        infowindow.open(map);
                    });
            } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                $("#no_results").show();
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
}

function loadScript() {
    var req = new XMLHttpRequest();
    req.open("GET",
        Xrm.Page.context.getClientUrl() + "/api/data/v8.2/fic_googlemapsconfigurations?$select=fic_apikey,fic_usegoogleaddress,fic_markericon,fic_defaultzoom",
        true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                if (results.value.length == 0) return;
                var apiKey = results.value[0]["fic_apikey"];
                useGoogleAddress = results.value[0]["fic_usegoogleaddress"];
                markerIcon = results.value[0]["fic_markericon"];
                defaultZoom = results.value[0]["fic_defaultzoom"];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey;
                script.onload = initialize;
                document.body.appendChild(script);
            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
}

loadScript();