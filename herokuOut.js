console.log("process.env.MONGOLAB_URI = " +process.env.MONGOLAB_URI);
function createDBSettings(mongoLabURI) {
    var dbSettings = {},
        regexp = /^mongodb:\/\/(\w+):(\w+)@(\w+):(\w+)\/(\w+)$/,
        matches = mongoLabURI.match(regexp);

    dbSettings.dbname = matches[5];
    dbSettings.host = matches[3];
    dbSettings.port = matches[4];
    dbSettings.username = matches[1];
    dbSettings.password = matches[2];

    return dbSettings;
}

var herokuDB = createDBSettings(process.env.MONGOLAB_URI);

console.log(herokuDB);
