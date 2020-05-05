const chalk = require("chalk");
const utils = require("./utils");
const settings = require("../settings.json");

settings.show = function() {
    let enabledAttackChars = [];

    for(let [charId, isEnable] of Object.entries(settings.attack.charIds)) {
        if (isEnable) {
            enabledAttackChars.push(charId);
        }
    }

    console.log(utils.header("Settings"));
    console.log(chalk`{magenta.underline Account}
Username: {bold ${settings.username}}
Password: {bold ${settings.password.replace()}}

{magenta.underline Attack}
Stop time at: {green <${settings.attack.stopWhenSaveTimeLessThan}}
Monster id  : {green ${settings.attack.monsterId}}
Enabled Char: {green ${enabledAttackChars.join(",")}}
    `);
}

module.exports = settings;
