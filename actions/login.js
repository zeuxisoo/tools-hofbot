const { client, settings } = require("../common");
const FormData = require("form-data");
const cheerio = require("cheerio");

// Parse response HTML content
function parseAccountInfo(loginHtml) {
    const $ = cheerio.load(loginHtml);

    let id       = $("#menu2 > div > div:nth-child(1)").text();
    let money    = $("#menu2 > div > div:nth-child(2) > div:nth-child(1)").text();
    let saveTime = $("#saveTime").text();

    id    = id.trim();
    money = money.match(/(?:\$\s)((?:[0-9]*)(?:,?[0-9]*)*)/)[1];

    return { id, money, saveTime };
}

// Parse response HTML content
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

// Main action
async function main() {
    const loginHtml   = await login(settings.username, settings.password);
    const accountInfo = parseAccountInfo(loginHtml);

    console.log(`[Login] ID: ${accountInfo.id}, Money: ${accountInfo.money}, Time : ${accountInfo.saveTime}`);
}

module.exports = main;
