const got = require("got");
const { CookieJar } = require("tough-cookie");

const cookeJar = new CookieJar();

const client = got.extend({
    prefixUrl: "http://h.e-talking.net/",
    cookieJar: cookeJar,
    headers  : {
        "user-agent": "hof-bot"
    },
});

module.exports = client;
