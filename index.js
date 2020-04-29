const got = require("got");
const { CookieJar } = require("tough-cookie");
const FormData = require("form-data");

const settings = require("./settings.json");

//
const cookeJar = new CookieJar();

const client = got.extend({
    prefixUrl: "http://h.e-talking.net/",
    cookieJar: cookeJar,
    headers  : {
        "user-agent": "hof-bot"
    },
});

//
function parseAccountInfo(loginHtml) {
    // TODO: parse username, money, time
}

//
async function login(username, password) {
    const formData = new FormData();
    formData.append("id", username);
    formData.append("pass", password);

    const response = await client("index.php", {
        method: "post",
        body  : formData,
    });

    return response.body;
}

async function main() {
    const loginHtml   = await login(settings.username, settings.password);
    const accountInfo = parseAccountInfo(loginHtml);
}

main();
