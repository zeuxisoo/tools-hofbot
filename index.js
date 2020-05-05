const got = require("got");
const { CookieJar } = require("tough-cookie");
const FormData = require("form-data");
const cheerio = require("cheerio");

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
    const $ = cheerio.load(loginHtml);

    let id       = $("#menu2 > div > div:nth-child(1)").text();
    let money    = $("#menu2 > div > div:nth-child(2) > div:nth-child(1)").text();
    let saveTime = $("#saveTime").text();

    id    = id.trim();
    money = money.match(/(?:\$\s)((?:[0-9]*)(?:,?[0-9]*)*)/)[1];

    return { id, money, saveTime };
}

function parseAttackInfo(attackHtml) {
    const $ = cheerio.load(attackHtml);

    const message  = $(".break-top .charge").text();
    const saveTime = $("#saveTime").text();

    return { message, saveTime };
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

async function attack() {
    const formData = new FormData();

    // TODO: char_[ID] to settings
    formData.append("char_[ID]", "1");
    formData.append("monster_battle", "戰鬥!");

    // TODO: monster id to settings
    const response = await client("index.php?common=[MONSTER_ID]", {
        method: "post",
        body  : formData,
    });

    return response.body;
}

//
async function loopAttack() {
    const attackHtml = await attack();
    const attackInfo = parseAttackInfo(attackHtml);

    console.log(`[Attack] message: ${attackInfo.message}, time: ${attackInfo.saveTime}`);

    if (attackInfo.saveTime > settings.attack.stopWhenSaveTimeLessThan) {
        loopAttack();
    }
}

async function main() {
    const loginHtml   = await login(settings.username, settings.password);
    const accountInfo = parseAccountInfo(loginHtml);

    console.log(`ID   : ${accountInfo.id}`);
    console.log(`Money: ${accountInfo.money}`);
    console.log(`Time : ${accountInfo.saveTime}`);

    console.log("\n-----\n");

    await loopAttack();
}

main();
