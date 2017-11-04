function getStoredApiKey() {
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
                if (results.value.length == 0) {
                    return;
                } else {
                    var configId = results.value[0]["fic_apikey"];
                    $('#apikey').val(configId);
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
    var req = new XMLHttpRequest();
    req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/fic_googlemapsconfigurations", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 204) {
                $(".alert").text("Key has been created successfuly!");
                $(".alert").show();
                setTimeout(function() { $(".alert").hide(); }, 3000);
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

    var req = new XMLHttpRequest();
    req.open("PATCH",
        Xrm.Page.context.getClientUrl() + "/api/data/v8.2/fic_googlemapsconfigurations(" + id + ")",
        true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 204) {
                $(".alert").text("Key has been updated successfuly!");
                $(".alert").show();
                setTimeout(function() { $(".alert").hide(); }, 3000);
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
    req.onreadystatechange = function() {
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
    function() {
        var key = document.getElementById('apikey').value;
        upsertKey(key);
    },
    false);