const chalk = require("chalk");
const settings = require("../settings.json");

function wrapSettings() {
    let enabledAttackChars = [];

    for(let [charId, isEnable] of Object.entries(settings.attack.charIds)) {
        if (isEnable) {
            enabledAttackChars.push(charId);
        }
    }

    console.log(chalk`
{black.bgWhite Settings}
--------
Username: {bold ${settings.username}}
Password: {bold ${settings.password.replace()}}

{black.bgWhite Attack}
--------
- Stop time at: {green <${settings.attack.stopWhenSaveTimeLessThan}}
- Monster id  : {green ${settings.attack.monsterId}}
- Enabled Char: {green ${enabledAttackChars.join(",")}}
`);

    return settings;
}

module.exports = wrapSettings();
