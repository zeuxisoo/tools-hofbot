const { program } = require("commander");
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
async function attack(attackType) {
    const formData = new FormData();

    for(let [charId, isEnable] of Object.entries(settings.attack.charIds)) {
        formData.append(charId, +isEnable);
    }

    if (attackType == "monster") {
        formData.append("monster_battle", "戰鬥!");

        const response = await client(`index.php?common=${settings.attack.monsterId}`, {
            method: "post",
            body  : formData,
        });

        return response.body;
    }

    if (attackType == "boss") {
        formData.append("union_battle", "1");

        // Check the needed next battle time first in hunt page
        const huntResponse = await client(`index.php?hunt`, {
            method: "get",
            hooks : {
                beforeRequest: [
                    options => {
                        // tricks code to fix the query string normalized `hunt=` to `hunt`
                        // - https://stackoverflow.com/a/4557763
                        options.url.search = options.url.search.replace(/=$/, "");
                    }
                ]
            }
        });

        const $ = cheerio.load(huntResponse.body);
        const timeLockMessage = $("#contents > div:nth-child(1) > div:nth-child(4)").text();

        const [,,nextBattleTime] = timeLockMessage.match(/(.*)\s:\s([0-9]+:[0-9+]+)/);

        // If the need next battle time is exists stop to attack
        if (nextBattleTime.trim().length > 0) {
            console.log(chalk`{yellow [Attack]} {bold ${nextBattleTime}} until the next battle time.`);

            process.exit(0);
        }else{
            const response = await client(`union=${settings.attack.bossId}`, {
                method: "post",
                body  : formData,
            });

            return response.body;
        }
    }
}

// Control flow
async function loopAttack(attackType) {
    const attackHtml = await attack(attackType);
    const attackInfo = parseAttackInfo(attackHtml);

    console.log(chalk`{yellow [Attack]} message: {bold ${attackInfo.message}}, time: {bold ${attackInfo.saveTime}}`);

    if (attackInfo.saveTime > settings.attack.stopWhenSaveTimeLessThan) {
        return await loopAttack(attackType);
    }
}

// Main action
async function main(command) {
    const attackType  = command.type;
    const attackTypes = ["monster", "boss"];

    if (attackTypes.includes(attackType) === true)  {
        settings.show();

        console.log(utils.header("Action"));
        console.log(`Attack type: ${attackType}\n`);

        await loginAction();
        await loopAttack(attackType);
    }else{
        console.log(program.help());
    }
}

module.exports = main;
