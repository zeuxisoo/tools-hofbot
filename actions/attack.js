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

function parseAttackInfo(attackHtml) {
    const $ = cheerio.load(attackHtml);

    const message  = $(".break-top .charge").text();
    const saveTime = $("#saveTime").text();

    return { message, saveTime };
}

// Make request action
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

    for(let [charId, isEnable] of Object.entries(settings.attack.charIds)) {
        formData.append(charId, +isEnable);
    }

    formData.append("monster_battle", "戰鬥!");

    const response = await client(`index.php?common=${settings.attack.monsterId}`, {
        method: "post",
        body  : formData,
    });

    return response.body;
}

// Control flow
async function loopAttack() {
    const attackHtml = await attack();
    const attackInfo = parseAttackInfo(attackHtml);

    console.log(`[Attack] message: ${attackInfo.message}, time: ${attackInfo.saveTime}`);

    if (attackInfo.saveTime > settings.attack.stopWhenSaveTimeLessThan) {
        loopAttack();
    }
}

// Main action
async function main() {
    const loginHtml   = await login(settings.username, settings.password);
    const accountInfo = parseAccountInfo(loginHtml);

    console.log(`ID   : ${accountInfo.id}`);
    console.log(`Money: ${accountInfo.money}`);
    console.log(`Time : ${accountInfo.saveTime}`);

    console.log("\n-----\n");

    await loopAttack();
}

module.exports = main
