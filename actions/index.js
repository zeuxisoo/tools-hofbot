const loginAction = require("./login");
const attackAction = require("./attack");
const charAction = require("./char");
const monsterAction = require("./monster");
const bossAction = require("./boss");
const timeTreeAction = require("./time-tree");
const settingsAction = require("./settings");

module.exports = {
    loginAction   : loginAction,
    attackAction  : attackAction,
    charAction    : charAction,
    monsterAction : monsterAction,
    bossAction    : bossAction,
    timeTreeAction: timeTreeAction,
    settingsAction: settingsAction,
}
