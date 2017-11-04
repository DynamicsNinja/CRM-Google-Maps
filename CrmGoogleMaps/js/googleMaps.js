function initialize() {
    var p = GetParameters();
    var map_canvas = document.getElementById('map_canvas');
    var map_options = {
        center: new google.maps.LatLng(-26.4420246, 133.281323),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(map_canvas, map_options)
    var geocoder = new google.maps.Geocoder();
    var address = window.parent.Xrm.Page.data.entity.attributes.get(p.address).getValue();
    geocoder.geocode({
            'address': address
        },
        function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(14);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    title: address
                });
                google.maps.event.addListener(marker,
                    'click',
                    function() {
                        var infowindow = new google.maps.InfoWindow({
                            content: marker.title,
                            position: marker.position,
                        });
                        infowindow.open(map);
                    });
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
}

function loadScript() {
    var req = new XMLHttpRequest();
    req.open("GET",
        Xrm.Page.context.getClientUrl() + "/api/data/v8.2/fic_googlemapsconfigurations?$select=fic_apikey",
        true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                if (results.value.length == 0) return;
                var apiKey = results.value[0]["fic_apikey"];
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