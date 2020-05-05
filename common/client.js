const got = require("got");
const { CookieJar } = require("tough-cookie");

const cookieJar = new CookieJar();

const client = got.extend({
    prefixUrl: "http://h.e-talking.net/",
    cookieJar: cookieJar,
    headers  : {
        "user-agent": "hof-bot"
    },
});

module.exports = client;
