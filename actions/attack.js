const FormData = require("form-data");
const cheerio = require("cheerio");
const chalk = require("chalk");
const { client, settings, utils } = require("../common");
const loginAction = require("./login");

// Parse response HTML content
function parseAttackInfo(attackHtml) {
    const $ = cheerio.load(attackHtml);

    const message  = $(".break-top .charge").text();
    const saveTime = $("#saveTime").text();

    return { message, saveTime };
}

// Make request action
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

    console.log(chalk`{yellow [Attack]} message: {bold ${attackInfo.message}}, time: {bold ${attackInfo.saveTime}}`);

    if (attackInfo.saveTime > settings.attack.stopWhenSaveTimeLessThan) {
        loopAttack();
    }
}

// Main action
async function main() {
    settings.show();

    console.log(utils.header("Action"));

    await loginAction();
    await loopAttack();
}

module.exports = main;
