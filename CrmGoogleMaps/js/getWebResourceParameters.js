var GetParameters = function() {
    try {
        var Parameters = GetGlobalContext().getQueryStringParameters();
        if (typeof Parameters !== "undefined") {
            return ParseParameters(Parameters.data);
        }
        return null;
    } catch (error) {
        errorHandler(error)
    }
}
var ParseParameters = function(Query) {
    try {
        var ResultParameters = {};

        //NULL CHECK
        if (Query != undefined && Query != null) {

            //SPLIR PARAMETERS
            var QuerySplit = Query.split("&");

            //PARSE PARAMETERS TO ARRAY
            for (var i = 0; i < QuerySplit.length; i++) {
                var ParameterPair = QuerySplit[i].split("=");
                ResultParameters[ParameterPair[0]] = ParameterPair.length > 1 ? ParameterPair[1] : null;
            }
        }
        return ResultParameters;

    } catch (error) {
        errorHandler(error);
    }
}