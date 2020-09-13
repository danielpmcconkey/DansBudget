module.exports = {

    getMostRecentSimFromDBReturn: function (dbReturn) {
        var latestReport = dbReturn[0];
        for (var i = 0; i < dbReturn.length; i++) {
            if (dbReturn[i].runTime > latestReport.runTime) latestReport = dbReturn[i];
        }
        return latestReport;
    }
}