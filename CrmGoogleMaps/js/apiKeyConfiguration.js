function getStoredApiKey() {
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
                if (results.value.length == 0) {
                    return;
                } else {
                    var configId = results.value[0]["fic_apikey"];
                    $('#apikey').val(configId);
                    var markerIcon = results.value[0]["fic_markericon"];
                    $('#markerIcon').val(markerIcon);
                    var useGoogleAddresses = results.value[0]["fic_usegoogleaddress"];
                    var defaultZoom = results.value[0]["fic_defaultzoom"];
                    $('#defaultzoom').val(defaultZoom);
                    $('#useGoogleAddresses').prop('checked', useGoogleAddresses);
                }
            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
}

function createKey(apiKey) {
    var entity = {};
    entity.fic_apikey = apiKey;
    entity.fic_usegoogleaddress = $('#useGoogleAddresses').prop('checked');
    entity.fic_markericon = $('#markerIcon').val();
    entity.fic_defaultzoom = $('#defaultzoom').val();
    var req = new XMLHttpRequest();
    req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/fic_googlemapsconfigurations", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 204) {
                $(".alert").text("Settings have been created successfuly!");
                $(".alert").show();
                setTimeout(function () {
                    $(".alert").hide();
                }, 3000);
            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send(JSON.stringify(entity));
}

function updateKey(key, id) {
    var entity = {};
    entity.fic_apikey = key;
    entity.fic_usegoogleaddress = $('#useGoogleAddresses').prop('checked');
    entity.fic_markericon = $('#markerIcon').val();
    entity.fic_defaultzoom = $('#defaultzoom').val();
    var req = new XMLHttpRequest();
    req.open("PATCH",
        Xrm.Page.context.getClientUrl() + "/api/data/v8.2/fic_googlemapsconfigurations(" + id + ")",
        true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 204) {
                $(".alert").text("Settings have been updated successfuly!");
                $(".alert").show();
                setTimeout(function () {
                    $(".alert").hide();
                }, 3000);
            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send(JSON.stringify(entity));
}

function upsertKey(key) {
    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/fic_googlemapsconfigurations", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                if (results.value.length == 0) {
                    createKey(key);
                } else {
                    var configId = results.value[0]["fic_googlemapsconfigurationid"].replace("{", "").replace("}", "");
                    updateKey(key, configId);
                }
            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
}

getStoredApiKey();
document.getElementById("update").addEventListener("click",
    function () {
        var key = document.getElementById('apikey').value;
        upsertKey(key);
    },
    false);

$("#markerIcon").change(function () {
    markerPreview = $('#markerIcon').val();
    $("#markerPreview").attr("src", markerPreview);
    $("#markerPreview").show();
});

for (var i = 1; i <= 20; i++) {
    switch (i) {
        case 1:
            $("#defaultzoom").append(new Option(i + " (World)", i));
            break;
        case 5:
            $("#defaultzoom").append(new Option(i + " (Continent)", i));
            break;
        case 10:
            $("#defaultzoom").append(new Option(i + " (City)", i));
            break;
        case 15:
            $("#defaultzoom").append(new Option(i + " (Street)", i));
            break;
        case 20:
            $("#defaultzoom").append(new Option(i + " (Building)", i));
            break;
        default:
            $("#defaultzoom").append(new Option(i, i));
    }
}

