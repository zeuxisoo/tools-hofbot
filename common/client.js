const got = require("got");
const { CookieJar } = require("tough-cookie");
const settings = require("../settings.json");

const cookieJar = new CookieJar();

const client = got.extend({
    prefixUrl: settings.endpoint,
    cookieJar: cookieJar,
    headers  : {
        "user-agent": "hof-bot"
    },
});

module.exports = client;
